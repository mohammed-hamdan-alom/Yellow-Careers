from api.models import Question
from rest_framework import serializers

class QuestionSerializer(serializers.ModelSerializer):
    """Serializer for the Question model handling creation and updating."""
    class Meta:
        model = Question
        fields = '__all__'