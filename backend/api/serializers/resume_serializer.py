from api.models.resume import *
from rest_framework import serializers
from . import AddressSerializer

class ResumeSerializer(serializers.ModelSerializer):
    '''Serializer for the Resume model handling creation and updating.'''
    class Meta:
        model = Resume
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class ResumeSoftSkillSerializer(serializers.ModelSerializer):
    '''Serializer for the SoftSkill model handling creation and updating.'''
    class Meta:
        model = SoftSkill
        fields = ('id','skill')
        read_only_fields = ('id', 'created_at', 'updated_at')

class ResumeTechnicalSkillSerializer(serializers.ModelSerializer):
    '''Serializer for the TechnicalSkill model handling creation and updating.'''
    class Meta:
        model = TechnicalSkill
        fields = ('id','skill')
        read_only_fields = ('id', 'created_at', 'updated_at')

class ResumeLanguageSerializer(serializers.ModelSerializer):
    '''Serializer for the Language model handling creation and updating.'''
    class Meta:
        model = Language
        fields = ('id','language','spoken_proficiency','written_proficiency')
        read_only_fields = ('id', 'created_at', 'updated_at')

class EducationSerializer(serializers.ModelSerializer):
    '''Serializer for the Education model handling creation and updating.'''
    address = AddressSerializer()
    class Meta:
        model = Education
        fields = ('id','course_name','start_date', 'end_date', 'level', 'institution', 'grade', 'address')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        '''Create and return a new `Education` instance, given the validated data.'''
        address_data = validated_data.pop('address')
        address_serializer = AddressSerializer(data=address_data)  
        if address_serializer.is_valid():
            address = address_serializer.save()


        education = Education.objects.create(address=address, **validated_data)
        return education

    def update(self, instance, validated_data):
        '''Update and return an existing `Education` instance, given the validated data.'''
        address_data = validated_data.pop('address', None)
        if address_data:
            address_serializer = AddressSerializer(instance.address, data=address_data)
            if address_serializer.is_valid():
                address_serializer.save()

        # Update the Education instance
        instance.course_name = validated_data.get('course_name', instance.course_name)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.level = validated_data.get('level', instance.level)
        instance.institution = validated_data.get('institution', instance.institution)
        instance.grade = validated_data.get('grade', instance.grade)
        instance.save()

        return instance

class ProfessionalExperienceSerializer(serializers.ModelSerializer):
    '''Serializer for the ProfessionalExperience model handling creation and updating.'''
    address = AddressSerializer()
    class Meta:
        model = ProfessionalExperience
        fields = ('id' ,'start_date', 'end_date', 'company', 'position', 'description', 'address')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        '''Create and return a new `ProfessionalExperience` instance, given the validated data.'''
        address_data = validated_data.pop('address')
        address_serializer = AddressSerializer(data=address_data)  
        if address_serializer.is_valid():
            address = address_serializer.save()

        professional_experience = ProfessionalExperience.objects.create(address=address, **validated_data)
        return professional_experience
    
    def update(self, instance, validated_data):
        '''Update and return an existing `ProfessionalExperience` instance, given the validated data.'''
        address_data = validated_data.pop('address', None)
        if address_data:
            address_serializer = AddressSerializer(instance.address, data=address_data)
            if address_serializer.is_valid():
                address_serializer.save()

        # Update the Professional experience instance
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.company = validated_data.get('company', instance.company)
        instance.position = validated_data.get('position', instance.position)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        return instance



