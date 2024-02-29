from api.models.resume import *
from rest_framework import serializers
from . import AddressSerializer

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

class EducationSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    class Meta:
        model = Education
        fields = ('id','start_date', 'end_date', 'level', 'institution', 'grade', 'address')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        address_data = validated_data.pop('address')
        address = Address.objects.create(**address_data)

        education = Education.objects.create(address=address, **validated_data)
        return education

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)
        if address_data:
            address_serializer = AddressSerializer(instance.address, data=address_data)
            if address_serializer.is_valid():
                address_serializer.save()
            else:
                raise serializers.ValidationError(address_serializer.errors)

        # Update the Education instance
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.level = validated_data.get('level', instance.level)
        instance.institution = validated_data.get('institution', instance.institution)
        instance.grade = validated_data.get('grade', instance.grade)
        instance.save()

        return instance

class ProfessionalExperienceSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    class Meta:
        model = ProfessionalExperience
        fields = ('id' ,'start_date', 'end_date', 'company', 'position', 'description', 'address')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        address_data = validated_data.pop('address')
        address = Address.objects.create(**address_data)

        professional_experience = ProfessionalExperience.objects.create(address=address, **validated_data)
        return professional_experience
    
    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)
        if address_data:
            address_serializer = AddressSerializer(instance.address, data=address_data)
            if address_serializer.is_valid():
                address_serializer.save()
            else:
                raise serializers.ValidationError(address_serializer.errors)

        # Update the Professional experience instance
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.company = validated_data.get('company', instance.company)
        instance.position = validated_data.get('position', instance.position)
        instance.save()

        return instance



