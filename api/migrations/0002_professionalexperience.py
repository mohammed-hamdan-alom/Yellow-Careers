# Generated by Django 5.0.1 on 2024-02-06 12:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProfessionalExperience',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('company', models.CharField(max_length=100)),
                ('position', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True, max_length=2000)),
                ('address', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='api.address')),
                ('resume', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.resume')),
            ],
        ),
    ]
