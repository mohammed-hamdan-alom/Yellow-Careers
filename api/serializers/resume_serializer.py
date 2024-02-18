from api.models import Resume, SoftSkill
from rest_framework import serializers

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class ResumeSoftSkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftSkill
        fields = ('skill',)
        read_only_fields = ('id', 'created_at', 'updated_at')