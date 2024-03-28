from api.models import EmployerJobRelation
from rest_framework import serializers

class EmployerJobRelationSerializer(serializers.ModelSerializer):
    """Serializer for the EmployerJobRelation model handling creation and updating."""
    class Meta:
        model = EmployerJobRelation
        fields = '__all__'