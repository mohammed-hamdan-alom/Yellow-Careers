from api.models import Address
from rest_framework import serializers

class AddressSerializer(serializers.ModelSerializer):
    """Serializer for the Address model handling creation and updating."""
    class Meta:
        model = Address
        fields = '__all__'

    def create(self, validated_data):
        '''Create and return a new `Address` instance, given the validated data.'''
        return Address.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        '''Update and return an existing `Address` instance, given the validated data.'''
        instance.city = validated_data.get('city', instance.city)
        instance.post_code = validated_data.get('post_code', instance.post_code)
        instance.country = validated_data.get('country', instance.country)
        instance.save()
        return instance
