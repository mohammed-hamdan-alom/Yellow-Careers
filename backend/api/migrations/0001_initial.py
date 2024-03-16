# Generated by Django 5.0.1 on 2024-03-16 00:16

import django.core.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('other_names', models.CharField(blank=True, max_length=50)),
                ('phone_number', models.CharField(max_length=15, validators=[django.core.validators.RegexValidator('^\\+?1?\\d{9,15}$')])),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'ordering': ['last_name', 'first_name'],
            },
        ),
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('city', models.CharField(max_length=50, validators=[django.core.validators.RegexValidator('^[a-zA-Z\\s]*$')])),
                ('post_code', models.CharField(max_length=50, validators=[django.core.validators.RegexValidator('^[a-zA-Z0-9\\s]*$')])),
                ('country', models.CharField(max_length=50, validators=[django.core.validators.RegexValidator('^[a-zA-Z\\s]*$')])),
            ],
        ),
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(max_length=100)),
                ('website', models.URLField(blank=True)),
                ('about', models.CharField(blank=True, max_length=1000)),
            ],
        ),
        migrations.CreateModel(
            name='Resume',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('github', models.URLField(blank=True, max_length=250)),
                ('linkedin', models.URLField(blank=True, max_length=250)),
                ('about', models.TextField(blank=True, max_length=2000)),
                ('experience', models.TextField(blank=True, max_length=2000)),
            ],
        ),
        migrations.CreateModel(
            name='Employer',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('is_company_admin', models.BooleanField(default=False)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
            ],
            options={
                'verbose_name': 'Employer',
            },
            bases=('api.user',),
        ),
        migrations.CreateModel(
            name='JobSeeker',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('dob', models.DateField()),
                ('nationality', models.CharField(max_length=100)),
                ('sex', models.CharField(choices=[('M', 'Male'), ('F', 'Female')], max_length=6)),
                ('address', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.address')),
                ('resume', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.resume')),
            ],
            options={
                'verbose_name': 'Job Seeker',
            },
            bases=('api.user',),
        ),
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=1000)),
                ('salary', models.PositiveIntegerField(blank=True, null=True)),
                ('job_type', models.CharField(choices=[('FT', 'Full time'), ('PT', 'Part time'), ('IN', 'Internship'), ('TM', 'Temporary')], max_length=20)),
                ('address', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.address')),
            ],
        ),
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_applied', models.DateField(auto_now_add=True)),
                ('status', models.CharField(choices=[('R', 'Read'), ('U', 'Unread')], default='U', max_length=1)),
                ('decision', models.CharField(choices=[('A', 'Accepted'), ('R', 'Rejected'), ('U', 'Undecided')], default='U', max_length=1)),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.job')),
                ('resume', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.resume')),
                ('job_seeker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.jobseeker')),
            ],
            options={
                'unique_together': {('job_seeker', 'job')},
            },
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=400)),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.job')),
            ],
            options={
                'unique_together': {('job', 'question')},
            },
        ),
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
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('language', models.CharField(max_length=30)),
                ('spoken_proficiency', models.CharField(choices=[('B', 'Basic'), ('I', 'Intermediate'), ('A', 'Advanced'), ('F', 'Fluent')], max_length=1)),
                ('written_proficiency', models.CharField(choices=[('B', 'Basic'), ('I', 'Intermediate'), ('A', 'Advanced'), ('F', 'Fluent')], max_length=1)),
                ('resume', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.resume')),
            ],
        ),
        migrations.CreateModel(
            name='Education',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course_name', models.CharField(max_length=50)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('level', models.CharField(choices=[('HS', 'High School'), ('BA', 'Bachelors'), ('MA', 'Masters'), ('PHD', 'Doctorate')], max_length=15)),
                ('institution', models.CharField(max_length=100)),
                ('grade', models.CharField(max_length=15)),
                ('address', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='api.address')),
                ('resume', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.resume')),
            ],
        ),
        migrations.CreateModel(
            name='SoftSkill',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('skill', models.CharField(max_length=30)),
                ('resume', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.resume')),
            ],
        ),
        migrations.CreateModel(
            name='TechnicalSkill',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('skill', models.CharField(max_length=30)),
                ('resume', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.resume')),
            ],
        ),
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answer', models.CharField(max_length=2000)),
                ('application', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='api.application')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.question')),
            ],
            options={
                'unique_together': {('application', 'question')},
            },
        ),
        migrations.CreateModel(
            name='EmployerJobRelation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.job')),
                ('employer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.employer')),
            ],
            options={
                'unique_together': {('employer', 'job')},
            },
        ),
        migrations.CreateModel(
            name='SavedJobs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.job')),
                ('job_seeker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.jobseeker')),
            ],
            options={
                'unique_together': {('job_seeker', 'job')},
            },
        ),
    ]
