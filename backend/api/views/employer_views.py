from rest_framework import generics
from api.models import Employer, EmployerJobRelation
from api.serializers import EmployerSerializer, ChangePasswordSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password
from rest_framework.response import Response
from rest_framework import generics, status


class BaseEmployerView:
    queryset = Employer.objects.all()
    serializer_class = EmployerSerializer

class EmployerListView(BaseEmployerView, generics.ListAPIView):
    pass

class LinkedEmployersView(BaseEmployerView, generics.ListAPIView):
    '''Retrieve all employers linked to a job. The job id is passed as a parameter in the url.'''
    def get_queryset(self):
        job_id = self.kwargs["pk"]
        employerjobrelations = EmployerJobRelation.objects.filter(job_id=job_id)
        return [employerjobrelation.employer for employerjobrelation in employerjobrelations]

class CompanyEmployersView(BaseEmployerView, generics.ListAPIView):
    '''Retrieve all employers in a company. The employer id is passed as a parameter in the url.'''
    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        employer = get_object_or_404(Employer, id=user_id)
        return Employer.objects.filter(company_id=employer.company)

class EmployerRetrieveView(BaseEmployerView, generics.RetrieveAPIView):
    pass

class EmployerCreateView(BaseEmployerView, generics.CreateAPIView):
    pass
    
class CompanyEmployerListView(BaseEmployerView, generics.ListAPIView):
    '''Retrieve all employers in a company. The company id is passed as a parameter in the url.'''
    def get_queryset(self):
        company_id = self.kwargs['pk']
        return Employer.objects.filter(company_id=company_id)

class EmployerUpdateView(BaseEmployerView, generics.RetrieveUpdateDestroyAPIView):
    pass

# class EmployerChangePasswordView(generics.UpdateAPIView):
#     serializer_class = ChangePasswordSerializer

#     def get_object(self):
#         return self.request.user

#     def update(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = self.get_serializer(data=request.data)

#         if serializer.is_valid():
#             old_password = serializer.validated_data.get("old_password")
#             new_password = serializer.validated_data.get("new_password")
#             confirm_password = serializer.validated_data.get("confirm_password")


#             if not check_password(old_password, instance.password):
#                 return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
#             if new_password != confirm_password:
#                 return Response({"error": "New password and confirm password do not match."}, status=status.HTTP_400_BAD_REQUEST)


#             instance.set_password(new_password)
#             instance.save()
#             return Response({"message": "Password changed successfully."})

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)