from api.models import InvitedEmployer
from rest_framework import serializers

class InvitedEmployerSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvitedEmployer
        fields = '__all__'
        read_only_fields = ['code']