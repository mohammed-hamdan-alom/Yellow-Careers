from api.models import JobSeeker, Address
from rest_framework import serializers

class JobSeekerSerializer(serializers.ModelSerializer):
    address = serializers.PrimaryKeyRelatedField(queryset=Address.objects.all())

    class Meta:
        model = JobSeeker
        fields = ['id', 'email', 'first_name', 'last_name', 'other_names', 'phone_number', 'dob', 'nationality' , 'sex' , 'address', 'resume']

    def create(self, validated_data):
        job_seeker = JobSeeker.objects.create(**validated_data)
        return job_seeker

    def update(self, instance, validated_data):
        address = validated_data.pop('address', None)
        if address:
            instance.address = address
            
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance