from django.apps import AppConfig

'''This class is used to configure the api app'''
class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
