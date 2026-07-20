import os
import glob
import re

drawer_item = """      <!-- Blogs -->
      <a href="./blogs.html" class="drawer-menu-item">
        <span class="drawer-menu-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#599632" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </span>
        <span class="drawer-menu-text">
          <span class="drawer-menu-title">Blogs</span>
          <span class="drawer-menu-desc">Read our latest insights</span>
        </span>
      </a>
"""

for file in glob.glob("*.html"):
    with open(file, "r") as f:
        content = f.read()
    
    modified = False
    
    # 1. Update Drawer Menu
    if 'class="drawer-menu-title">Blogs<' not in content:
        # Try to insert before Contact (which can be #contact or ./contact.html)
        # We look for the start of the Contact a tag.
        match = re.search(r'(\s*<!-- Contact -->\s*)?<a href="(?:\./contact\.html|#contact)" class="drawer-menu-item">', content)
        if match:
            # Insert before the matched contact section
            start = match.start()
            content = content[:start] + "\n" + drawer_item + "\n" + content[start:]
            modified = True
            
    # 2. Update Footer Link
    if 'href="./blogs.html"' not in content or ('class="swap-text-orig">Blogs<' in content and 'href="./blogs.html"' not in content):
        # It might be #blogs or ./home.html#blogs
        content, n = re.subn(r'href="(?:#blogs|\./home\.html#blogs)"(\s+class="swap-link")', r'href="./blogs.html"\1', content)
        if n > 0:
            modified = True
        else:
            # If not found, maybe we insert it before Contact Us
            if 'class="swap-text-orig">Blogs<' not in content:
                footer_item = """          <li>
            <a href="./blogs.html" class="swap-link">
              <span class="swap-wrap">
                <span class="swap-text-orig">Blogs</span>
                <span class="swap-text-dup" aria-hidden="true">Blogs</span>
              </span>
            </a>
          </li>"""
                match = re.search(r'(\s*<li>\s*<a href="(?:\./contact\.html|#contact)" class="swap-link">\s*<span class="swap-wrap">\s*<span class="swap-text-orig">Contact Us</span>)', content)
                if match:
                    start = match.start()
                    content = content[:start] + "\n" + footer_item + "\n" + content[start:]
                    modified = True

    if modified:
        with open(file, "w") as f:
            f.write(content)
        print(f"Updated {file}")

