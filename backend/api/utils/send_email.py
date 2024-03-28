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
    
def send_employer_invitation_email(email, company_name, code):
    """
    Send an invitation email to a new employer.
    """
    subject = f"You're invited to join {company_name} on Yellow Careers"
    html_content = (
        f"<h3>{company_name} has invited you to join as an employer in the company.</h3>\n\n"
        f"<p>When registering, please use your email and the following code to create your account: {code}</p>"
    )
    send_email(email, subject, html_content)

def send_job_application_confirmation(email, job_title, company_name):
    """
    Send a confirmation email to a jobseeker after applying for a job.
    """
    subject = f"Application Received for {job_title} at {company_name}"
    html_content = (
        f"<h3>Your application for {job_title} at {company_name} has been received.</h3>\n\n"
        f"<p>We appreciate your interest in joining our company. You may be contacted by our team soon.</p>"
    )
    send_email(email, subject, html_content)

def send_job_application_result(email, job_title, company_name, is_accepted):
    """
    Send an email to a jobseeker notifying them of acceptance or rejection for a job.
    """
    if is_accepted:
        subject = f"You've been accepted to join {company_name} as a {job_title}"
        html_content = (
            f"<h3>Congratulations! We're thrilled to inform you that you've been accepted to join {company_name} as a {job_title}.</h3>\n\n"
            f"<p>Your skills and passion stood out, and we're eager to see the amazing things we'll accomplish together.</p>\n"
            f"<p>Our team will be in touch soon to discuss the next steps. We can't wait to get started!</p>"
        )
    else:
        subject = f"Update on your application to {company_name} for the role of {job_title}"
        html_content = (
            f"<h3>Thank you for your interest in the {job_title} position at {company_name}.</h3>\n\n"
            f"<p>After careful consideration, we regret to inform you that we have decided to move forward with other candidates at this time.</p\n\n>"
            f"<p>We greatly appreciate the time and effort you invested in this application and wish you the best of luck in your future endeavours.</p>\n"
            f"<p>Thank you once again for your interest in our company.</p>"
        )
    send_email(email, subject, html_content)

def send_job_access_notification(email, job_title, company_name, is_created_by_employer):
    """
    Send an email to an employer when they either create a job listing or when they are added to it.
    """
    if is_created_by_employer:
        subject = f"Job Listing Created for {job_title}"
        html_content = (
            f"<h3>Your job listing for {job_title} has been successfully created on behalf of {company_name}.</h3>\n\n"
            f"<p>You can now receive applications from interested candidates. You may archive the job at any time to prevent new applicants from viewing or applying to the job.</p>"
        )
    else:
        subject = f"Access Granted to job listing for {job_title}"
        html_content = (
            f"<h3>You have been granted access to manage the job listing for {job_title} at {company_name}.</h3>\n\n"
            f"<p>This allows you to view applications and manage candidates. You may also archive the job at any time to prevent new applicants from viewing or applying to the job.</p>"
        )
    send_email(email, subject, html_content)
