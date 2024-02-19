from api.models.resume import *
from rest_framework import serializers

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class ResumeSoftSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftSkill
        fields = ('id','skill')
        read_only_fields = ('id', 'created_at', 'updated_at')

class ResumeTechnicalSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnicalSkill
        fields = ('id','skill')
        read_only_fields = ('id', 'created_at', 'updated_at')

class ResumeLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ('id','language','spoken_proficiency','written_proficiency')
        read_only_fields = ('id', 'created_at', 'updated_at')