from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_email(to_emails, subject, html_content):
    message = Mail(
        from_email='seg.yellow.careers@gmail.com',
        to_emails=to_emails,
        subject=subject,
        html_content=html_content)
    try:
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)
        print('Email sent successfully:', response.status_code)
    except Exception as e:
        print('Error in sending email:', e)
        raise Exception('Error in sending email')