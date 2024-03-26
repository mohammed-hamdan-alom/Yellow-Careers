from api.models import Job, Address
from rest_framework import serializers
from . import AddressSerializer

class JobSerializer(serializers.ModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = Job
        fields = '__all__'

    def create(self, validated_data):
        address_data = validated_data.pop('address')
        address_serializer = AddressSerializer(data=address_data)  
        if address_serializer.is_valid():
            address = address_serializer.save()
        else:
            raise serializers.ValidationError(address_serializer.errors)

        job = Job.objects.create(
            title=validated_data['title'],
            description=validated_data['description'],
            address=address,
            job_type=validated_data['job_type'],
            salary=validated_data['salary']
        )
        job.save()
        return job