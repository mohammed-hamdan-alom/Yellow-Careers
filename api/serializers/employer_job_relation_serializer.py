from api.models import EmployerJobRelation
from rest_framework import serializers

class EmployerJobRelationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerJobRelation
        fields = '__all__'