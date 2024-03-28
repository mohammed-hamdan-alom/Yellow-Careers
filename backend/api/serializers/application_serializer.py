from api.models import Application
from rest_framework import serializers

class ApplicationSerializer(serializers.ModelSerializer):
    """Serializer for the Application model handling creation and updating."""
    class Meta:
        model = Application
        fields = '__all__'