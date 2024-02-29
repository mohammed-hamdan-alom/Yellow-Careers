from api.models import Employer
from rest_framework import serializers

class EmployerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employer
        fields = ['id', 'email', 'first_name', 'last_name', 'other_names', 'phone_number', 'is_company_admin', 'company']