from api.models import Company
from rest_framework import serializers

class CompanySerializer(serializers.ModelSerializer):
    """Serializer for the Company model handling creation and updating."""
    class Meta:
        model = Company
        fields = '__all__'