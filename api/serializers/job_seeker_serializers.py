from api.models import JobSeeker
from rest_framework import serializers

class JobSeekerSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeeker
        fields = ['id','email','first_name', 'last_name', 'other_names', 'phone_number', 'dob', 'nationality' , 'sex' , 'address', 'resume']