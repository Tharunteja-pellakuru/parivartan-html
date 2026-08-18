<?php
// Prevent PHP warnings/errors from corrupting JSON output
error_reporting(0);
ini_set('display_errors', 0);

// Set headers for JSON response
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'errors' => ['Method Not Allowed']]);
    exit;
}

$errors = [];

// Retrieve POST variables
$name    = trim($_POST["fullName"] ?? '');
$email   = trim($_POST["email"] ?? '');
$phone   = trim($_POST["phone"] ?? '');
$website = trim($_POST["website"] ?? '');
$service = trim($_POST["service"] ?? '');
$message = trim($_POST["message"] ?? '');
$captcha = $_POST['g-recaptcha-response'] ?? '';

/* -----------------------------
   VALIDATION
----------------------------- */
if ($name === '') {
    $errors[] = "Name is required";
} elseif (!preg_match('/^[a-zA-Z,\-\s]+$/', $name)) {
    $errors[] = "Enter valid full name (English letters only)";
}

if ($email === '') {
    $errors[] = "Email is required";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Enter valid email address";
}

if ($phone === '') {
    $errors[] = "Phone number is required";
} elseif (!preg_match('/^\+?\d[\d\s]*$/', $phone)) {
    $errors[] = "Enter valid phone number";
} else {
    $cleanedPhone = preg_replace('/\s+/', '', $phone);
    if (strlen($cleanedPhone) < 10 || strlen($cleanedPhone) > 25) {
        $errors[] = "Phone number must be between 10 and 25 digits";
    }
}

if ($website !== '') {
    if (!filter_var($website, FILTER_VALIDATE_URL)) {
        $errors[] = "Enter valid website URL";
    }
}

if ($service === '') {
    $errors[] = "Service selection is required";
}

if ($message !== '') {
    if (strlen($message) > 2000) {
        $errors[] = "Message must not exceed 2000 characters";
    } elseif (!preg_match('/^[A-Za-z0-9\s.,!?\'"\-()]+$/', $message)) {
        $errors[] = "Message must contain English characters only";
    } elseif (preg_match('/https?:\/\/|www\./i', $message)) {
        $errors[] = "Message should not contain website links";
    } elseif (preg_match('/<[^>]*>/', $message)) {
        $errors[] = "HTML tags are not allowed in message";
    }
}

if (empty($captcha)) {
    $errors[] = "Please complete the reCAPTCHA verification";
}

/* -----------------------------
   RECAPTCHA VERIFICATION
----------------------------- */
if (empty($errors)) {
    $secret = '6LdrhwoUAAAAAMt073rLU5v5gc79BJ-_AJnM1lK4';
    
    $ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        'secret'   => $secret,
        'response' => $captcha,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ]);
    
    $responseJson = curl_exec($ch);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($responseJson) {
        $response = json_decode($responseJson, true);
        if (!$response || !$response['success']) {
            $errors[] = "Robot verification failed, please try again";
        }
    } else {
        error_log("Google reCAPTCHA verification cURL failed: " . $curlError);
        $errors[] = "Robot verification check failed to connect. Please try again.";
    }
}

// Return errors if any
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Raw copies for CRM posting
$rawName    = $name;
$rawEmail   = $email;
$rawPhone   = $phone;
$rawWebsite = $website;
$rawMessage = $message;

// Safe encoding for email inclusion
$name    = htmlspecialchars($name,    ENT_QUOTES, 'UTF-8');
$email   = htmlspecialchars($email,   ENT_QUOTES, 'UTF-8');
$phone   = htmlspecialchars($phone,   ENT_QUOTES, 'UTF-8');
$website = htmlspecialchars($website, ENT_QUOTES, 'UTF-8');
$service = htmlspecialchars($service, ENT_QUOTES, 'UTF-8');
$message = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

/* -----------------------------
   BREVO API SETTINGS
----------------------------- */
$brevoApiKey = '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';
$fromEmail   = 'smo@eparivartan.com';
$fromName    = 'eParivartan';

function sendBrevoEmail($apiKey, $fromEmail, $fromName, $toEmail, $toName, $subject, $htmlContent, $replyToEmail = null, $replyToName = null) {
    $data = [
        'sender'      => ['name' => $fromName, 'email' => $fromEmail],
        'to'          => [['email' => $toEmail, 'name' => $toName]],
        'subject'     => $subject,
        'htmlContent' => $htmlContent
    ];

    if ($replyToEmail) {
        $data['replyTo'] = ['email' => $replyToEmail, 'name' => $replyToName ?? $replyToEmail];
    }

    $ch = curl_init('https://api.brevo.com/v3/smtp/email');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'accept: application/json',
        'api-key: ' . $apiKey,
        'content-type: application/json'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode === 201;
}

/* -----------------------------
   EMAIL TEMPLATE — Confirmation to User
----------------------------- */
$clientBody = '
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 0;">
        <tr>
            <td align="center">
                <table align="center" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(15,23,42,0.03);">
                    <!-- TOP BRAND HEADER -->
                    <tr>
                        <td style="padding:40px 40px 24px 40px;text-align:center;">
                            <img src="https://eparivartan.com/images/logo.svg" alt="eParivartan Logo" style="height:38px;display:inline-block;vertical-align:middle;" />
                            <div style="height:1px;background-color:#f1f5f9;margin-top:24px;"></div>
                        </td>
                    </tr>

                    <!-- HEADING -->
                    <tr>
                        <td style="padding:0 40px 24px 40px;">
                            <span style="display:inline-block;background-color:#f0fdf4;color:#166534;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;border-radius:20px;margin-bottom:12px;">Enquiry Received</span>
                            <h2 style="color:#0f172a;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;line-height:1.2;">Thank you for reaching out! 🙏</h2>
                            <p style="color:#475569;font-size:15px;margin:8px 0 0 0;line-height:1.6;">
                                Hello <strong>'. $name .'</strong>,<br><br>
                                We\'re glad you visited <a href="https://eparivartan.com" style="color:#85bd56;text-decoration:none;font-weight:600;">eparivartan.com</a>. We have received your query regarding <strong>'. $service .'</strong>, and a member of our team will review it and get in touch with you shortly.
                            </p>
                        </td>
                    </tr>

                    <!-- SERVICE BOX -->
                    <tr>
                        <td style="padding:0 40px 30px 40px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-left:4px solid #85bd56;border-radius:0 8px 8px 0;">
                                <tr>
                                    <td style="padding:16px 20px;">
                                        <p style="margin:0;color:#2d6a2d;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">What Happens Next?</p>
                                        <p style="margin:6px 0 0 0;color:#475569;font-size:14px;line-height:1.6;">
                                            Our consultants will analyze your project description and contact you within 24 business hours to discuss the next steps.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- CTA BUTTON -->
                    <tr>
                        <td style="padding:0 40px 40px 40px;text-align:center;">
                            <a href="https://eparivartan.com" style="display:inline-block;background-color:#85bd56;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.5px;box-shadow:0 4px 6px rgba(133,189,86,0.15);">
                                Explore Our Portfolio
                            </a>
                        </td>
                    </tr>

                    <!-- CONTACT CHANNELS -->
                    <tr>
                        <td style="background-color:#f8fafc;padding:24px 40px;border-top:1px solid #f1f5f9;text-align:center;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="50%" style="text-align:center;padding:10px;">
                                        <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Direct Line</p>
                                        <p style="margin:4px 0 0 0;font-size:14px;color:#1e293b;font-weight:700;">+91 98491 65443</p>
                                    </td>
                                    <td width="50%" style="text-align:center;padding:10px;border-left:1px solid #e2e8f0;">
                                        <p style="margin:0;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Email Support</p>
                                        <p style="margin:4px 0 0 0;font-size:14px;color:#85bd56;font-weight:700;"><a href="mailto:feedback@eparivartan.com" style="color:#85bd56;text-decoration:none;">feedback@eparivartan.com</a></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style="background-color:#0f172a;padding:20px 40px;text-align:center;">
                            <p style="margin:0;color:#94a3b8;font-size:11px;line-height:1.6;">
                                © 2026 eParivartan. Vasudha Avenue, Road No 10, Kavuri Hills, Hyderabad - 500033
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';

/* -----------------------------
   EMAIL TEMPLATE — Admin Notification
----------------------------- */
$adminBody = '
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 0;">
        <tr>
            <td align="center">
                <table align="center" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(15,23,42,0.03);">
                    <!-- TOP BRAND HEADER -->
                    <tr>
                        <td style="padding:40px 40px 24px 40px;text-align:center;">
                            <img src="https://eparivartan.com/images/logo.svg" alt="eParivartan Logo" style="height:38px;display:inline-block;vertical-align:middle;" />
                            <div style="height:1px;background-color:#f1f5f9;margin-top:24px;"></div>
                        </td>
                    </tr>

                    <!-- HEADING -->
                    <tr>
                        <td style="padding:0 40px 24px 40px;">
                            <span style="display:inline-block;background-color:#f0fdf4;color:#166534;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;border-radius:20px;margin-bottom:12px;">New Inquiry</span>
                            <h2 style="color:#0f172a;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;line-height:1.2;">Project Requirement Details</h2>
                            <p style="color:#475569;font-size:14px;margin:8px 0 0 0;line-height:1.5;">A new request has been submitted through the eParivartan contact form.</p>
                        </td>
                    </tr>

                    <!-- CONTENT DETAILS -->
                    <tr>
                        <td style="padding:0 40px 30px 40px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f1f5f9;border-radius:12px;overflow:hidden;background-color:#fafbfd;">
                                <tr>
                                    <td style="padding:16px 20px;border-bottom:1px solid #f1f5f9;width:30%;vertical-align:top;">
                                        <span style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;display:block;">Client Name</span>
                                    </td>
                                    <td style="padding:16px 20px;border-bottom:1px solid #f1f5f9;vertical-align:top;">
                                        <strong style="color:#0f172a;font-size:15px;font-weight:600;">'. $name .'</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:16px 20px;border-bottom:1px solid #f1f5f9;vertical-align:top;">
                                        <span style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;display:block;">Email</span>
                                    </td>
                                    <td style="padding:16px 20px;border-bottom:1px solid #f1f5f9;vertical-align:top;">
                                        <a href="mailto:'. $email .'" style="color:#3b82f6;font-size:15px;text-decoration:none;font-weight:500;">'. $email .'</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:16px 20px;border-bottom:1px solid #f1f5f9;vertical-align:top;">
                                        <span style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;display:block;">Phone</span>
                                    </td>
                                    <td style="padding:16px 20px;border-bottom:1px solid #f1f5f9;vertical-align:top;">
                                        <span style="color:#0f172a;font-size:15px;font-weight:500;">'. $phone .'</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:16px 20px;border-bottom:1px solid #f1f5f9;vertical-align:top;">
                                        <span style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;display:block;">Website</span>
                                    </td>
                                    <td style="padding:16px 20px;border-bottom:1px solid #f1f5f9;vertical-align:top;">
                                        <span style="color:#0f172a;font-size:15px;">'. ($website ? '<a href="'.$website.'" style="color:#3b82f6;text-decoration:none;font-weight:500;">'.$website.'</a>' : '<span style="color:#94a3b8;font-style:italic;">Not provided</span>') .'</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:16px 20px;border-bottom:1px solid #f1f5f9;vertical-align:top;">
                                        <span style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;display:block;">Service</span>
                                    </td>
                                    <td style="padding:16px 20px;border-bottom:1px solid #f1f5f9;vertical-align:top;">
                                        <span style="display:inline-block;background-color:#f1f5f9;color:#334155;font-size:13px;font-weight:600;padding:4px 10px;border-radius:6px;">'. $service .'</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:16px 20px;vertical-align:top;">
                                        <span style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;display:block;">Message</span>
                                    </td>
                                    <td style="padding:16px 20px;vertical-align:top;">
                                        <p style="color:#334155;font-size:14px;line-height:1.6;margin:0;white-space:pre-line;">'. ($message ? $message : '<span style="color:#94a3b8;font-style:italic;">No message provided</span>') .'</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- REPLY BUTTON -->
                    <tr>
                        <td style="padding:0 40px 40px 40px;text-align:center;">
                            <a href="mailto:'. $email .'" style="display:inline-block;background-color:#85bd56;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.5px;box-shadow:0 4px 6px rgba(133,189,86,0.15);">
                                Reply to '. $name .'
                            </a>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style="background-color:#f8fafc;padding:24px 40px;border-top:1px solid #f1f5f9;text-align:center;">
                            <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
                                This is an automated notification from <a href="https://eparivartan.com" style="color:#64748b;text-decoration:none;font-weight:600;">eParivartan</a>.
                            </p>
                            <p style="margin:4px 0 0 0;color:#cbd5e1;font-size:11px;">
                                Vasudha Avenue, Kavuri Hills, Hyderabad, India
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';;

$adminSubject = "New Enquiry from $name — eParivartan";

// Send emails in background
// 1. Client Confirmation
sendBrevoEmail($brevoApiKey, $fromEmail, $fromName, $rawEmail, $rawName, "We've received your enquiry — eParivartan", $clientBody, 'feedback@eparivartan.com', 'eParivartan');

// 2. Admin notification - feedback@eparivartan.com (COMMENTED FOR TESTING)
sendBrevoEmail($brevoApiKey, $fromEmail, $fromName, 'feedback@eparivartan.com', 'eParivartan Team', $adminSubject, $adminBody, $rawEmail, $rawName);

// 4. Admin notification - Chaitanya (COMMENTED FOR TESTING)
$sent = sendBrevoEmail($brevoApiKey, $fromEmail, $fromName, 'chaitanya.eparivartan@gmail.com', 'Chaitanya', $adminSubject, $adminBody, $rawEmail, $rawName);

/* -----------------------------
   CRM API INTEGRATION
----------------------------- */
$crmUrl = 'https://crmadmin.whysocial.in/api/add-enquiry';
$crmPayload = [
    'full_name'    => $rawName,
    'phone_number' => $rawPhone,
    'email'        => $rawEmail,
    'website_url'  => $rawWebsite,
    'source'       => 'eParivartan',
    'message'      => $rawMessage,
    'status'       => 'New'
];

$crmCh = curl_init($crmUrl);
curl_setopt($crmCh, CURLOPT_RETURNTRANSFER, true);
curl_setopt($crmCh, CURLOPT_POST, true);
curl_setopt($crmCh, CURLOPT_POSTFIELDS, json_encode($crmPayload));
curl_setopt($crmCh, CURLOPT_TIMEOUT, 10);
curl_setopt($crmCh, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

$crmResponse = curl_exec($crmCh);
$crmHttpCode = curl_getinfo($crmCh, CURLINFO_HTTP_CODE);
$crmError = curl_error($crmCh);
curl_close($crmCh);

if ($crmError) {
    error_log("CRM API Error (cURL): " . $crmError);
} else {
    if ($crmHttpCode < 200 || $crmHttpCode >= 300) {
        error_log("CRM API Error (HTTP Code $crmHttpCode): " . $crmResponse);
    }
}

// Return JSON response to the front-end AJAX caller
if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'errors' => ['Failed to send notification email. Please try again.']]);
}
exit;
