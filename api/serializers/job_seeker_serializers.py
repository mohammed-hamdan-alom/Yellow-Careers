from api.models import JobSeeker

from rest_framework import serializers

class JobSeekerSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeeker
        fields = ['first_name', 'last_name', 'other_names', 'phone_number', 'dob', 'sex', 'nationality']

    def create(self, validated_data):
        return JobSeeker.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.other_names = validated_data.get('other_names', instance.other_names)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.dob = validated_data.get('dob', instance.dob)
        instance.address = validated_data.get('address', instance.address)
        instance.sex = validated_data.get('sex', instance.sex)
        instance.nationality = validated_data.get('nationality', instance.nationality)
        instance.save()
        return instance