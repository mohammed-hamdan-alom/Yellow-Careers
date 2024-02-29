from api.models import SoftSkill, TechnicalSkill, Education
from rest_framework import serializers

class SoftSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftSkill
        fields = '__all__'

class TechnicalSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnicalSkill
        fields = '__all__'

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'