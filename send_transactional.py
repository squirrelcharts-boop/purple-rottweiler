#!/usr/bin/env python3
"""
send_transactional.py

Reads recipients from emails.txt, sends a constant-subject HTML email (no auth),
moves successful recipients to sent_emails.txt, prints progress with colored output.

Requirements:
    pip install colorama

Usage:
    python3 send_transactional.py
"""

import smtplib
import time
import os
import sys
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from colorama import init as colorama_init, Fore, Style

# ----------------- CONFIG -----------------
SMTP_HOST = "45.148.31.191"   # change if needed
SMTP_PORT = 25                   # use 25 for unauthenticated send, or 587 if configured
FROM_EMAIL = "rule34@5885357.xyz"

# CONSTANT subject and HTML body — edit these with your content
SUBJECT = "[SEXUALLY EXPLICIT] A new world awaits you!"
HTML_BODY = """<!DOCTYPE html><html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en-US"><head><title></title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><!--[if mso]>
<xml><w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"><w:DontUseAdvancedTypographyReadingMail/></w:WordDocument>
<o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml>
<![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css2?family=Permanent+Marker:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"><!--<![endif]--><style>
*{box-sizing:border-box}body{margin:0;padding:0}a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important}#MessageViewBody a{color:inherit;text-decoration:none}p{line-height:inherit}.desktop_hide,.desktop_hide table{mso-hide:all;display:none;max-height:0;overflow:hidden}.image_block img+div{display:none}sub,sup{font-size:75%;line-height:0} @media (max-width:670px){.mobile_hide{display:none}.row-content{width:100%!important}.stack .column{width:100%;display:block}.mobile_hide{min-height:0;max-height:0;max-width:0;overflow:hidden;font-size:0}.desktop_hide,.desktop_hide table{display:table!important;max-height:none!important}.row-1 .column-1 .block-1.heading_block h1{font-size:34px!important}}
</style><!--[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style> <![endif]--></head><body class="body" style="background-color:#000;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none"><table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#000"><tbody><tr><td><table class="row row-1" align="center" 
width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#080012;background-size:auto"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-size:auto;color:#000;width:650px;margin:0 auto" width="650"><tbody><tr><td class="column column-1" width="100%" 
style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:50px;padding-left:15px;padding-right:15px;padding-top:50px;vertical-align:top"><table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="pad" style="padding-top:15px;text-align:center;width:100%"><h1 
style="margin:0;color:#fff;direction:ltr;font-family:'Permanent Marker',Impact,Charcoal,sans-serif;font-size:69px;font-weight:400;letter-spacing:-1px;line-height:1.2;text-align:center;margin-top:0;margin-bottom:0;mso-line-height-alt:83px"><strong>A new porn world awaits</strong></h1></td></tr></table><table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td 
class="pad"><div style="color:#fff;direction:ltr;font-family:'Permanent Marker',Impact,Charcoal,sans-serif;font-size:19px;font-weight:400;letter-spacing:0;line-height:1.5;text-align:center;mso-line-height-alt:29px"><p style="margin:0;margin-bottom:16px">We’ve prepared a little surprise for you, some amazing animated porn, just for you! Something warm, simple and just your style.</p><p style="margin:0">
Just search for your favorite character, kink or position, and see what everyone's been talking about.</p></div></td></tr></table><table class="image_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="pad" style="width:100%"><div class="alignment" align="center"><div style="max-width:620px"><img src="https://f86f635eb1.imgdist.com/pub/bfra/8jkcbns7/fs4/hlb/9z8/headerru%20%281%29.png" 
style="display:block;height:auto;border:0;width:100%" width="620" alt="Space" title="Space" height="auto"></div></div></td></tr></table><table class="button_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px;text-align:center"><div class="alignment" align="center">
<a href="https://rule34.pics" target="_blank" style="color:#ffffff;text-decoration:none;"><!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"  href="https://rule34.pics"  style="height:82px;width:285px;v-text-anchor:middle;" arcsize="2%" fillcolor="#29003d">
<v:stroke dashstyle="Solid" weight="0px" color="#FFE5AC"/>
<w:anchorlock/>
<v:textbox inset="0px,0px,0px,0px">
<center dir="false" style="color:#ffffff;font-family:'Trebuchet MS', Tahoma, sans-serif;font-size:26px">
<![endif]-->
<span class="button" style="background-color: #29003d; mso-shading: transparent; border-bottom: 0px solid #FFE5AC; border-left: 0px solid #FFE5AC; border-radius: 1px; border-right: 0px solid #FFE5AC; border-top: 0px solid #FFE5AC; color: #ffffff; display: inline-block; font-family: 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; font-size: 26px; font-weight: undefined; mso-border-alt: none; padding-bottom: 15px; padding-top: 15px; padding-left: 35px; padding-right: 35px; text-align: center; width: auto; word-break: keep-all; letter-spacing: normal;"><span style="word-break: break-word; line-height: 52px;"><strong>DISCOVER IT NOW</strong></span></span>
<!--[if mso]></center></v:textbox></v:roundrect><![endif]--></a></div></td></tr></table><table class="paragraph_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td class="pad"><div style="color:#545454;direction:ltr;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:16px;font-weight:400;letter-spacing:0;line-height:1.2;text-align:center;mso-line-height-alt:19px"><p 
style="margin:0">If the above button doesn't work you may use: <a href="https://rule34.pics" target="_blank" style="text-decoration: underline; color: #7747FF;" rel="noopener">https://rule34.pics</a></p></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#080012">
<tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#080012;border-radius:0;color:#000;width:650px;margin:0 auto" width="650"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top"><table class="divider_block block-1" width="100%" 
border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="pad"><div class="alignment" align="center"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="95%" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="divider_inner" style="font-size:1px;line-height:1px;border-top:1px solid #304358"><span style="word-break: break-word;">&#8202;</span></td></tr></table></div></td></tr></table><table 
class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td class="pad"><div style="color:#303030;direction:ltr;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:9px;font-weight:400;letter-spacing:0;line-height:1.2;text-align:center;mso-line-height-alt:11px"><p style="margin:0;margin-bottom:16px">Marketing email from WhiteOaks, OU © 2025</p><p 
style="margin:0;margin-bottom:16px">444 Alaska Avenue, Suite #CHQ695, Torrance, CA 90503</p><p style="margin:0">To stop receiving marketing emails please respond to this email with simply the message "unsubscribe".</p></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#080012"><tbody><tr><td>
<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#080012;color:#000;width:650px;margin:0 auto" width="650"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top"><div class="spacer_block block-1" style="height:40px;line-height:40px;font-size:1px">&#8202;</div></td></tr></tbody>
</table></td></tr></tbody></table></td></tr></tbody></table><!-- End --></body></html>"""

EMAILS_FILE = "emails.txt"
SENT_FILE = "sent_emails.txt"
FAILED_FILE = "failed_emails.txt"   # optional: log failures
SOCKET_TIMEOUT = 30                 # seconds for SMTP connect
DELAY_BETWEEN_SENDS = 0          # seconds pause between sends (tune as needed)
# ------------------------------------------

colorama_init(autoreset=True)

# pretty rainbow cycle for success prints
RAINBOW = [Fore.MAGENTA, Fore.RED, Fore.YELLOW, Fore.GREEN, Fore.CYAN, Fore.BLUE]


def read_recipients(path):
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        lines = [ln.strip() for ln in f.readlines()]
    # Filter out blanks and comments
    emails = [ln for ln in lines if ln and not ln.startswith("#")]
    return emails


def atomic_write(path, lines):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write("\n".join(lines).strip() + ("\n" if lines else ""))
    os.replace(tmp, path)


def append_line(path, line):
    with open(path, "a", encoding="utf-8") as f:
        f.write(line.rstrip() + "\n")


def build_message(to_addr):
    msg = MIMEMultipart("alternative")
    msg["From"] = FROM_EMAIL
    msg["To"] = to_addr
    msg["Subject"] = SUBJECT
    part_html = MIMEText(HTML_BODY, "html")
    msg.attach(part_html)
    return msg


def send_email_smtp(to_addr):
    """
    Send one email using plain SMTP (no auth).
    Returns True on success, False on failure (and raises exception for caller to log).
    """
    msg = build_message(to_addr)
    # connect
    with smtplib.SMTP(host=SMTP_HOST, port=SMTP_PORT, timeout=SOCKET_TIMEOUT) as smtp:
        # If server advertises STARTTLS and port is 587 or TLS desired, we could call starttls()
        # But per your config you are using no-auth/local-auth; we will not attempt TLS here unless port == 587
        if SMTP_PORT == 587:
            try:
                smtp.ehlo()
                smtp.starttls()
                smtp.ehlo()
            except Exception:
                # ignore starttls failure if server doesn't like it; connection may still work
                pass
        # no login since you requested no authentication
        smtp.send_message(msg)
    return True


def human_rate(sent_count, elapsed_seconds):
    if elapsed_seconds <= 0.1:
        return float("inf")
    per_min = sent_count / (elapsed_seconds / 60.0)
    return per_min


def main():
    # Read recipients
    recipients = read_recipients(EMAILS_FILE)
    total = len(recipients)
    if total == 0:
        print(Fore.YELLOW + "No recipients found in " + EMAILS_FILE)
        return

    print(Fore.CYAN + f"Starting send run: {total} recipients loaded from {EMAILS_FILE}")
    start_time = time.time()
    sent = 0
    failures = 0
    rainbow_idx = 0

    # We'll process a copy of the list; after each success we rewrite emails.txt with remaining recipients
    remaining = recipients.copy()

    for idx, rcpt in enumerate(recipients, start=1):
        try:
            t0 = time.time()
            send_email_smtp(rcpt)
            t1 = time.time()
            sent += 1
            # append to sent_emails.txt
            append_line(SENT_FILE, rcpt)
            # remove from remaining list and atomically write back
            remaining.remove(rcpt)
            atomic_write(EMAILS_FILE, remaining)

            elapsed = time.time() - start_time
            rate = human_rate(sent, elapsed)
            color = RAINBOW[rainbow_idx % len(RAINBOW)]
            rainbow_idx += 1

            print(color + f"[{sent}/{total}] Sent {rcpt} ({sent}/{total}) - approx {rate:.1f} emails/min | took {t1-t0:.2f}s")
        except Exception as e:
            failures += 1
            # log failure; keep the failed email in emails.txt for retry; append to failure log
            append_line(FAILED_FILE, f"{rcpt}  # error: {e}")
            # show error in red
            print(Fore.RED + f"[{sent}/{total}] Failed {rcpt} -> {e}")
        # small delay to avoid rapid-fire sending that looks spammy
        time.sleep(DELAY_BETWEEN_SENDS)

    total_elapsed = time.time() - start_time
    final_rate = human_rate(sent, total_elapsed)
    print(Style.BRIGHT + Fore.GREEN + f"Done. Sent: {sent}/{total}  Failures: {failures}. Average rate: {final_rate:.1f} emails/min")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(Fore.YELLOW + "\nInterrupted by user. Exiting.")
        sys.exit(0)
