# Generated by Django 5.0.1 on 2024-01-29 17:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resume',
            name='github',
            field=models.URLField(blank=True, max_length=250),
        ),
        migrations.AlterField(
            model_name='resume',
            name='linkedin',
            field=models.URLField(blank=True, max_length=250),
        ),
    ]
