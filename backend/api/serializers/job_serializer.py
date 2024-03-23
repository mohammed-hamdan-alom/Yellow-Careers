from api.models import Job, Address
from rest_framework import serializers
from . import AddressSerializer

class JobSerializer(serializers.ModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'job_type', 'salary', 'address']

    def create(self, validated_data):
        address_data = validated_data.pop('address')
        address = Address.objects.create(**address_data)

        job = Job.objects.create(
            title=validated_data['title'],
            description=validated_data['description'],
            address=address,
            job_type=validated_data['job_type'],
            salary=validated_data['salary']
        )
        job.save()
        return job

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)
        if address_data:
            address_serializer = AddressSerializer(instance.address, data=address_data)
            if address_serializer.is_valid():
                address_serializer.save()
            else:
                raise serializers.ValidationError(address_serializer.errors)

        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.job_type = validated_data.get('job_type', instance.job_type)
        instance.salary = validated_data.get('salary', instance.salary)
        instance.save()
        return instance