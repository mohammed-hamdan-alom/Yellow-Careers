from api.models import Job
from rest_framework import serializers

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['title', 'description', 'address', 'job_type', 'salary']
        
    def create(self, validated_data):
        job = Job.objects.create(
            title=validated_data['title'],
            description=validated_data['description'],
            address=validated_data['address'],
            job_type=validated_data['job_type'],
            salary=validated_data['salary']
        )
        job.save()
        return job
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.address = validated_data.get('address', instance.address)
        instance.job_type = validated_data.get('job_type', instance.job_type)
        instance.salary = validated_data.get('salary', instance.salary)
        instance.save()
        return instance
