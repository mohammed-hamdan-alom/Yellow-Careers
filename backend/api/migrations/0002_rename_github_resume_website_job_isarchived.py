# Generated by Django 5.0.1 on 2024-03-27 15:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='resume',
            old_name='github',
            new_name='website',
        ),
        migrations.AddField(
            model_name='job',
            name='isArchived',
            field=models.BooleanField(default=False),
        ),
    ]
