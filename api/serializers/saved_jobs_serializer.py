from api.models import SavedJobs
from rest_framework import serializers

class SavedJobsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedJobs
        fields = '__all__'