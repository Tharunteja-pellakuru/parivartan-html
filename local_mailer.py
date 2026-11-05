#!/usr/bin/env python3
import http.server
import json
import smtplib
import ssl
import urllib.request
import urllib.parse
import email
from email.policy import default
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

HOST = '127.0.0.1'
PORT = 5505

SMTP_HOST = 'smtp.gmail.com'
SMTP_PORT = 465
SMTP_USER = 'ceo@eparivartan.com'
SMTP_PASS = 'ymxfvkrzujvhxtxx'
FROM_EMAIL = 'ceo@eparivartan.com'
FROM_NAME = 'eParivartan'

ADMIN_EMAILS = ['feedback@eparivartan.com', 'chaitanya.eparivartan@gmail.com', 'ceo@eparivartan.com']

def send_email(to_emails, subject, html_content, reply_to=None):
    if isinstance(to_emails, str):
        to_emails = [to_emails]

    msg = MIMEMultipart('alternative')
    msg['From'] = f'{FROM_NAME} <{FROM_EMAIL}>'
    msg['To'] = ', '.join(to_emails)
    msg['Subject'] = subject
    if reply_to:
        msg['Reply-To'] = reply_to

    msg.attach(MIMEText(html_content, 'html', 'utf-8'))

    context = ssl.create_default_context()
    for attempt in range(3):
        try:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context, timeout=15) as server:
                server.login(SMTP_USER, SMTP_PASS)
                server.sendmail(FROM_EMAIL, to_emails, msg.as_string())
            return True
        except Exception as e:
            if attempt < 2:
                import time
                time.sleep(1)
                continue
            raise e

def post_to_crm(payload):
    try:
        url = 'https://crmadmin.whysocial.in/api/add-enquiry'
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers={
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        with urllib.request.urlopen(req, timeout=5) as response:
            return response.status in (200, 201)
    except Exception as e:
        print(f'[CRM] Warning: {e}')
        return False

class MailerHandler(http.server.BaseHTTPRequestHandler):
    def _send_cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Accept')

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors()
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self._send_cors()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({'status': 'active', 'service': 'eParivartan Local Mailer'}).encode())

    def do_POST(self):
        content_type = self.headers.get('Content-Type', '')
        length = int(self.headers.get('Content-Length', 0))
        raw_body = self.rfile.read(length)
        
        name = ''
        email_val = ''
        phone = ''
        website = ''
        service = ''
        message = ''

        if 'multipart/form-data' in content_type:
            headers_bytes = f'Content-Type: {content_type}\r\n\r\n'.encode('utf-8')
            msg = email.message_from_bytes(headers_bytes + raw_body, policy=default)
            for part in msg.iter_parts():
                field_name = part.get_param('name', header='content-disposition')
                val = part.get_content().strip() if hasattr(part, 'get_content') else part.get_payload().strip()
                if field_name == 'fullName': name = val
                elif field_name == 'email': email_val = val
                elif field_name == 'phone': phone = val
                elif field_name == 'website': website = val
                elif field_name == 'service': service = val
                elif field_name == 'message': message = val
        else:
            body_str = raw_body.decode('utf-8')
            try:
                data = json.loads(body_str)
                name = data.get('fullName', '').strip()
                email_val = data.get('email', '').strip()
                phone = data.get('phone', '').strip()
                website = data.get('website', '').strip()
                service = data.get('service', '').strip()
                message = data.get('message', '').strip()
            except Exception:
                parsed = urllib.parse.parse_qs(body_str)
                name = parsed.get('fullName', [''])[0].strip()
                email_val = parsed.get('email', [''])[0].strip()
                phone = parsed.get('phone', [''])[0].strip()
                website = parsed.get('website', [''])[0].strip()
                service = parsed.get('service', [''])[0].strip()
                message = parsed.get('message', [''])[0].strip()

        print(f'[MAILER] Processing inquiry: {name} <{email_val}> - {service}')

        errors = []
        if not name: errors.append('Full name is required')
        if not email_val: errors.append('Email is required')
        if not phone: errors.append('Phone number is required')
        if not service: errors.append('Service is required')

        if errors:
            self.send_response(400)
            self._send_cors()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'errors': errors}).encode())
            return

        client_html = f"""
        <!DOCTYPE html><html><body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px;">
        <div style="max-width: 560px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f172a;">Thank you for reaching out, {name}!</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6;">
            We have received your enquiry regarding <strong>{service}</strong>. A member of our team will review your requirements and get in touch with you shortly.
          </p>
          <div style="background: #f0fdf4; border-left: 4px solid #85bd56; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #166534; font-weight: bold;">What happens next?</p>
            <p style="margin: 6px 0 0; color: #475569; font-size: 14px;">Our consultants will review your project and connect with you within 24 business hours.</p>
          </div>
          <p style="color: #64748b; font-size: 13px;">Direct Line: <strong>+91 98491 65443</strong> | Email: <a href="mailto:feedback@eparivartan.com" style="color: #85bd56;">feedback@eparivartan.com</a></p>
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 11px;">© 2026 eParivartan. Vasudha Avenue, Kavuri Hills, Hyderabad - 500033</p>
        </div></body></html>
        """

        admin_html = f"""
        <!DOCTYPE html><html><body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px;">
        <div style="max-width: 560px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <span style="background: #f0fdf4; color: #166534; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 20px;">NEW INQUIRY (eParivartan)</span>
          <h2 style="color: #0f172a; margin: 12px 0;">New Project Inquiry from {name}</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Name:</td><td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a;"><strong>{name}</strong></td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Email:</td><td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:{email_val}" style="color: #3b82f6;">{email_val}</a></td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Phone:</td><td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a;">{phone}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Service:</td><td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a;"><strong>{service}</strong></td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Website:</td><td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a;">{website or 'None'}</td></tr>
            <tr><td style="padding: 10px; color: #64748b; font-weight: 600; vertical-align: top;">Message:</td><td style="padding: 10px; color: #334155;">{message or 'None'}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 11px;">eParivartan Automated Notification System</p>
        </div></body></html>
        """

        # Send emails and post to CRM asynchronously in background thread so user gets instant response
        def dispatch_async():
            try:
                # 1. Send client confirmation
                print(f'[MAILER] Sending confirmation email to client: {email_val}...')
                send_email(email_val, "We've received your enquiry — eParivartan", client_html, reply_to='feedback@eparivartan.com')
                print(f'[MAILER] Client email sent successfully!')
            except Exception as e:
                print(f'[MAILER] Error sending client email: {e}')

            try:
                # 2. Send admin alert
                print(f'[MAILER] Sending admin notifications to {ADMIN_EMAILS}...')
                send_email(ADMIN_EMAILS, f"New Enquiry from {name} — eParivartan", admin_html, reply_to=email_val)
                print(f'[MAILER] Admin emails sent successfully!')
            except Exception as e:
                print(f'[MAILER] Error sending admin email: {e}')

            # 3. Post to CRM
            post_to_crm({
                'full_name': name,
                'phone_number': phone,
                'email': email_val,
                'service_type': service,
                'website_url': website,
                'source': 'eParivartan',
                'message': message,
                'status': 'New'
            })

        import threading
        threading.Thread(target=dispatch_async, daemon=True).start()

        self.send_response(200)
        self._send_cors()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({'success': True}).encode())

if __name__ == '__main__':
    server = http.server.ThreadingHTTPServer((HOST, PORT), MailerHandler)
    print(f'Local Mailer running on http://{HOST}:{PORT}')
    server.serve_forever()
