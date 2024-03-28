from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
import secrets
from api.models import InvitedEmployer
from api.serializers import InvitedEmployerSerializer
from api.utils.send_email import send_employer_invitation_email

class InvitedEmployerCreateView(generics.CreateAPIView):
    '''Create view for the InvitedEmployer model.'''

    queryset = InvitedEmployer.objects.all()
    serializer_class = InvitedEmployerSerializer

    def perform_create(self, serializer):
        code = secrets.token_urlsafe(10)
        instance = serializer.save(code=code)

        send_employer_invitation_email(instance.email, instance.company.company_name, code)

class InvitedEmployerRetrieveByEmailView(APIView):
    '''Retrieve view for the InvitedEmployer model. The email is passed as a query parameter.'''
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
    '''Delete view for the InvitedEmployer model. The email is passed as a query parameter.'''
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