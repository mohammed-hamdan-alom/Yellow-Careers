from api.models import Job
from rest_framework import serializers
from . import AddressSerializer

class JobSerializer(serializers.ModelSerializer):
    """Serializer for the Job model handling creation and updating."""
    address = AddressSerializer()

    class Meta:
        model = Job
        fields = '__all__'

    def create(self, validated_data):
        '''Create a new job with the given data.'''
        address_data = validated_data.pop('address')
        address_serializer = AddressSerializer(data=address_data)  
        if address_serializer.is_valid():
            address = address_serializer.save()

        job = Job.objects.create(
            title=validated_data['title'],
            description=validated_data['description'],
            address=address,
            job_type=validated_data['job_type'],
            salary=validated_data['salary']
        )
        job.save()
        return job