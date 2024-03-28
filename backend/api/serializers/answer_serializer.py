from api.models import Answer
from rest_framework import serializers

class AnswerSerializer(serializers.ModelSerializer):
    """Serializer for the Answer model handling creation and updating."""
    class Meta:
        model = Answer
        fields = '__all__'