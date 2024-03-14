from rest_framework import generics, status
from rest_framework.response import Response
import secrets
from api.models import InvitedEmployer, Company
from api.serializers import InvitedEmployerSerializer
from api.utils.send_email import send_email

class InvitedEmployerCreateView(generics.CreateAPIView):
    queryset = InvitedEmployer.objects.all()
    serializer_class = InvitedEmployerSerializer

    def perform_create(self, serializer):
        code = secrets.token_urlsafe(10)
        instance = serializer.save(code=code)

        company_name = serializer.validated_data['company'].company_name        
        subject = f"You're invited to join {company_name} on YellowCareers"
        html_content = f"<h3>{company_name} has invited you to join as an employer</h3>\n\n<p>When registering, please use the following code to create your account: {code}</p>"
        send_email(instance.email, subject, html_content)

class InvitedEmployerUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InvitedEmployer.objects.all()
    serializer_class = InvitedEmployerSerializer