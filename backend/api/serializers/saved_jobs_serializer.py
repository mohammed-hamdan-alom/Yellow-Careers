from api.models import SavedJobs
from rest_framework import serializers

class SavedJobsSerializer(serializers.ModelSerializer):
    '''Serializer for the SavedJobs model handling creation and updating.'''
    class Meta:
        model = SavedJobs
        fields = '__all__'