from api.models import JobSeeker, Address
from . import AddressSerializer
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
# from django.core.exceptions import ValidationError

class JobSeekerSerializer(serializers.ModelSerializer):
    address = AddressSerializer(required=False)

    class Meta:
        model = JobSeeker
        fields = ['id', 'email', 'first_name', 'last_name', 'other_names', 'phone_number', 'dob', 'nationality' , 'sex' , 'address', 'resume']

    def create(self, validated_data):
        address_data = validated_data.pop('address', None)
        address = None

        if address_data:
            address_serializer = AddressSerializer(data=address_data)  
            if address_serializer.is_valid():
                address = address_serializer.save()
            else:
                raise serializers.ValidationError(address_serializer.errors)
        
        job_seeker = JobSeeker.objects.create(address=address, **validated_data)
        return job_seeker

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)

        if address_data:
            if instance.address:
                address_serializer = AddressSerializer(instance.address, data=address_data)
                if address_serializer.is_valid():
                    address_serializer.save()
                else:
                    raise serializers.ValidationError(address_serializer.errors)
            else:
                address_serializer = AddressSerializer(data=address_data)  
                if address_serializer.is_valid():
                    instance.address = address_serializer.save()
                else:
                    raise serializers.ValidationError(address_serializer.errors)
            
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
    