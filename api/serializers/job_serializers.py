from api.models import Job
from rest_framework import serializers

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
        
    def create(self, validated_data):
        return Job.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.location = validated_data.get('location', instance.location)
        instance.job_type = validated_data.get('job_type', instance.job_type)
        instance.salary = validated_data.get('salary', instance.salary)
        instance.save()
        return instance