import random
from django.core.management.base import BaseCommand, CommandError
from faker import Faker
from api.models import User, JobSeeker, Employer, Job, Application, Resume, SoftSkill, TechnicalSkill, Language, Education, ProfessionalExperience, Address
from faker.providers import BaseProvider

class CustomWordProvider(BaseProvider):
    def word_with_max_length(self, max_length=30):
        word = self.generator.word()
        return word[:max_length]
    
    def paragraph_with_max_length(self, max_length=2000):
        paragraph = self.generator.paragraph()
        return paragraph[:max_length]
    
class Command(BaseCommand):
    help = 'Seeds the database with fake data'

    PASSWORD = 'Password123'
    JOB_SEEKER_COUNT = 10
    EMPLOYER_COUNT = 10
    ADDRESS_COUNT = 40
    SOFT_SKILL_COUNT = 10
    TECHNICAL_SKILL_COUNT = 10
    LANGUAGE_COUNT = 10
    EDUCATION_COUNT = 10
    PROFFESSIONAL_EXPERIENCE_COUNT = 10


    def __init__(self):
        super().__init__()
        self.faker = Faker('en_GB')
        self.faker.add_provider(CustomWordProvider)
        print('seeding')

        JobSeeker.objects.all().delete()
        jobby = JobSeeker.objects.create_user(
            email="beans@cheese.com",
            first_name="Beans",
            last_name="Cheese",
            password="Password123",
            phone_number="1234567890",
            dob="1999-01-01",
            nationality="Nigerian",
            sex="M",
        )
        jobby.save()
            


    def handle(self, *args, **options):
        self.seed_resumes()

        job_seeker = JobSeeker.objects.get(email='beans@cheese.com')
        random_resume = random.choice(Resume.objects.all())

        job_seeker.resume = random_resume
        job_seeker.save()

        
    def seed_address(self):
        '''Seed an adress'''
        address = Address.objects.create(
            city=self.faker.city(),
            post_code=self.faker.postcode(),
            country=self.faker.country()
        )
        address.save()
        return address


    def seed_resumes(self):
        '''Seeding the resumes'''
        self.seed_base_resumes()
        self.seed_soft_skills()
        self.seed_technical_skills()
        self.seed_languages()
        self.seed_educations()
        self.seed_professional_experience()

    def seed_base_resumes(self):
        '''Seeding the base resumes'''
        for _ in range(self.JOB_SEEKER_COUNT):
            resume = Resume.objects.create(
                github=self.faker.url(),
                linkedin=self.faker.url(),
                about=self.faker.paragraph_with_max_length(),
                experience=self.faker.paragraph_with_max_length(),
            )
            resume.save()
    
    def seed_soft_skills(self):
        '''Seeding the soft skills'''
        resumes = Resume.objects.all()
        if resumes.exists():
            for _ in range (self.SOFT_SKILL_COUNT):
                random_resume = random.choice(resumes)
                soft_skill = SoftSkill.objects.create(skill = self.faker.word_with_max_length(), resume=random_resume)
                soft_skill.save()

    def seed_technical_skills(self):
        ''''Seeding the technical skills'''
        resumes = Resume.objects.all()
        if resumes.exists():
            for _ in range (self.TECHNICAL_SKILL_COUNT):
                random_resume = random.choice(resumes)
                technical_skill = TechnicalSkill.objects.create(skill = self.faker.word_with_max_length(), resume=random_resume)
                technical_skill.save()

    def seed_languages(self):
        '''Seeding the languages'''
        resumes = Resume.objects.all()
        if resumes.exists():
            for _ in range (self.LANGUAGE_COUNT):
                random_resume = random.choice(resumes)
                new_language = Language.objects.create(language=self.faker.word_with_max_length(), resume=random_resume)
                new_language.save()

    def seed_educations(self):
        '''Seeding the educations'''
        resumes = Resume.objects.all()

        if resumes.exists():
            for _ in range (self.EDUCATION_COUNT):
                random_resume = random.choice(resumes)
                new_address = self.seed_address()

                start_date = self.faker.date_between(start_date='-10y', end_date='-1y')
                end_date = self.faker.date_between(start_date=start_date, end_date='today')

                education = Education.objects.create(
                    start_date=start_date,
                    end_date=end_date,
                    address=new_address,
                    level=random.choice([choice[0] for choice in Education.Levels.choices]),
                    institution=self.faker.company(),
                    grade=self.faker.random_int(min=1, max=100),
                    resume=random_resume
                )
                education.save()

    def seed_professional_experience(self):
        '''Seeding the professional experience'''
        resumes = Resume.objects.all()

        if resumes.exists():
            for _ in range (self.PROFFESSIONAL_EXPERIENCE_COUNT):
                random_resume = random.choice(resumes)
                new_address = self.seed_address()

                start_date = self.faker.date_between(start_date='-10y', end_date='-1y')
                end_date = self.faker.date_between(start_date=start_date, end_date='today')

                professional_experience = ProfessionalExperience.objects.create(
                    start_date=start_date,
                    end_date=end_date,
                    address=new_address,
                    company=self.faker.company(),
                    position=self.faker.job(),
                    description=self.faker.paragraph_with_max_length(),
                    resume=random_resume
                )
                professional_experience.save()
