from api.models import JobSeeker, Address
from rest_framework import serializers


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['city', 'post_code', 'country']


class JobSeekerSerializer(serializers.ModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = JobSeeker
        fields = ['id','email','first_name', 'last_name', 'other_names', 'phone_number', 'dob', 'nationality' , 'sex' , 'address', 'resume']
        extra_kwargs = {
            'email': {'read_only': True}
        }

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if address_data:
            AddressSerializer().update(instance.address, address_data)

        instance.save()
        return instance
