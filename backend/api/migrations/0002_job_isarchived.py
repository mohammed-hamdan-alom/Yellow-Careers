# Generated by Django 5.0.1 on 2024-03-26 14:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='isArchived',
            field=models.BooleanField(default=False),
        ),
    ]
