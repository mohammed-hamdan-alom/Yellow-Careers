from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
import secrets
from api.models import InvitedEmployer
from api.serializers import InvitedEmployerSerializer
from api.utils.send_email import send_email

class InvitedEmployerCreateView(generics.CreateAPIView):
    queryset = InvitedEmployer.objects.all()
    serializer_class = InvitedEmployerSerializer

    def perform_create(self, serializer):
        code = secrets.token_urlsafe(10)
        instance = serializer.save(code=code)

        company_name = serializer.validated_data['company'].company_name        
        subject = f"You're invited to join {company_name} on Yellow Careers"
        html_content = f"<h3>{company_name} has invited you to join as an employer</h3>\n\n<p>When registering, please use the following code to create your account: {code}</p>"
        send_email(instance.email, subject, html_content)

class InvitedEmployerRetrieveByEmailView(APIView):
    def get(self, request, *args, **kwargs):
        email = request.query_params.get('email')
        if not email:
            return Response({'error': 'Email parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            invited_employer = InvitedEmployer.objects.get(email=email)
            serializer = InvitedEmployerSerializer(invited_employer)
            return Response(serializer.data)
        except InvitedEmployer.DoesNotExist:
            return Response({'error': 'InvitedEmployer with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
class InvitedEmployerDeleteByEmailView(APIView):
    def delete(self, request, *args, **kwargs):
        email = request.query_params.get('email')
        if not email:
            return Response({'error': 'Email parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            invited_employer = InvitedEmployer.objects.get(email=email)
            invited_employer.delete()
            return Response({'message': 'InvitedEmployer deleted successfully'})
        except InvitedEmployer.DoesNotExist:
            return Response({'error': 'InvitedEmployer with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)