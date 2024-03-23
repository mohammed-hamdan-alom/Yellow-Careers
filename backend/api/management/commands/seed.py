import random
from django.core.management.base import BaseCommand, CommandError
from faker import Faker
from api.models import User, JobSeeker, Employer, Job, Application, Resume, SoftSkill, TechnicalSkill, Language, Education, ProfessionalExperience, Address, Company, Question, Answer, EmployerJobRelation
from faker.providers import BaseProvider
from halo import Halo
import csv

class CustomWordProvider(BaseProvider):
    '''Custom word provider for faker'''

    def word_with_max_length(self, max_length=30):
        '''Generate a word with a maximum length'''
        word = self.generator.word()
        return word[:max_length]
    
    def paragraph_with_max_length(self, max_length=2000):
        '''Generate a paragraph with a maximum length'''
        paragraph = self.generator.paragraph()
        return paragraph[:max_length]
    
class Command(BaseCommand):
    help = 'Seeds the database with fake data'

    PASSWORD = 'Password123_'
    JOB_SEEKER_COUNT = RESUME_COUNT = 100
    EMPLOYER_COUNT = 100
    COMPANY_COUNT = 30
    JOB_COUNT = QUESTION_COUNT = 200 
    SOFT_SKILL_COUNT = TECHNICAL_SKILL_COUNT = LANGUAGE_COUNT = EDUCATION_COUNT = PROFFESSIONAL_EXPERIENCE_COUNT = 200
    EMPLOYER_JOB_RELATION_COUNT = 200
    APPLICATION_COUNT = 100


    def __init__(self):
        super().__init__()
        self.faker = Faker('en_GB')
        self.faker.add_provider(CustomWordProvider)

    @Halo(text='Seeding the database', spinner='dots')
    def handle(self, *args, **options):
        self.seed_resumes()
        self.seed_job_seekers()
        self.seed_companies()
        self.seed_employers()
        self.seed_jobs()
        self.seed_questions()
        self.seed_employer_job_relationship()
        self.seed_applications()
        self.seed_answers()
        
    def seed_address(self):
        '''Seed an adress'''
        address = Address.objects.create(
            city=self.faker.city(),
            post_code=self.faker.postcode(),
            country=self.faker.country()
        )
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
        for i in range(self.JOB_SEEKER_COUNT):

            Resume.objects.create(
                github=self.faker.url(),
                linkedin=self.faker.url(),
                about=self.faker.paragraph_with_max_length(),
                experience=self.faker.paragraph_with_max_length(),
            )
    
    def seed_soft_skills(self):
        '''Seeding the soft skills'''
        resumes = Resume.objects.all()
        if resumes.exists():
            for i in range (self.SOFT_SKILL_COUNT):

                random_resume = random.choice(resumes)
                SoftSkill.objects.create(skill = self.faker.word_with_max_length(), resume=random_resume)

    def seed_technical_skills(self):
        ''''Seeding the technical skills'''
        resumes = Resume.objects.all()
        if resumes.exists():
            for i in range (self.TECHNICAL_SKILL_COUNT):

                random_resume = random.choice(resumes)
                TechnicalSkill.objects.create(skill = self.faker.word_with_max_length(), resume=random_resume)

    def seed_languages(self):
        '''Seeding the languages'''
        resumes = Resume.objects.all()
        if resumes.exists():
            for i in range (self.LANGUAGE_COUNT):

                random_resume = random.choice(resumes)
                Language.objects.create(
                    language=self.faker.word_with_max_length(),
                    spoken_proficiency=random.choice([choice[0] for choice in Language.Proficiency.choices]),
                    written_proficiency=random.choice([choice[0] for choice in Language.Proficiency.choices]),
                    resume=random_resume)

    def seed_educations(self):
        '''Seeding the educations'''
        resumes = Resume.objects.all()

        if resumes.exists():
            for i in range (self.EDUCATION_COUNT):

                random_resume = random.choice(resumes)
                new_address = self.seed_address()

                start_date = self.faker.date_between(start_date='-10y', end_date='-1y')
                end_date = self.faker.date_between(start_date=start_date, end_date='today')

                Education.objects.create(
                    course_name=self.faker.word(),
                    start_date=start_date,
                    end_date=end_date,
                    address=new_address,
                    level=random.choice([choice[0] for choice in Education.Levels.choices]),
                    institution=self.faker.company(),
                    grade=self.faker.random_int(min=1, max=100),
                    resume=random_resume
                )

    def seed_professional_experience(self):
        '''Seeding the professional experience'''
        resumes = Resume.objects.all()

        if resumes.exists():
            for i in range (self.PROFFESSIONAL_EXPERIENCE_COUNT):

                random_resume = random.choice(resumes)
                new_address = self.seed_address()

                start_date = self.faker.date_between(start_date='-10y', end_date='-1y')
                end_date = self.faker.date_between(start_date=start_date, end_date='today')

                ProfessionalExperience.objects.create(
                    start_date=start_date,
                    end_date=end_date,
                    address=new_address,
                    company=self.faker.company(),
                    position=self.faker.job(),
                    description=self.faker.paragraph_with_max_length(),
                    resume=random_resume
                )

    def generate_unique_email(self):
        email = self.faker.email()

        while User.objects.filter(email=email).exists():
            email = self.faker.email()

        return email

    def seed_job_seekers(self):
        resumes = list(Resume.objects.all())
        for i in range(self.JOB_SEEKER_COUNT):

            new_address = self.seed_address()
            random_resume = random.choice(resumes)
            resumes.remove(random_resume)
            phone_number = self.faker.numerify(text='+1##########')


            jobseeker = JobSeeker.objects.create(
                email=self.generate_unique_email(),
                first_name=self.faker.first_name(),
                last_name=self.faker.last_name(),
                other_names=self.faker.first_name(),
                phone_number=phone_number,
                dob=self.faker.date_of_birth(minimum_age=18, maximum_age=65),
                address=new_address,
                nationality = self.faker.country(),
                resume=random_resume,
                sex=random.choice(['M', 'F'])
            )
            jobseeker.set_password(self.PASSWORD)
            jobseeker.save()

    def seed_companies(self):
        '''Seeding the companies'''
        for i in range(self.COMPANY_COUNT):

            Company.objects.create(
                company_name=self.faker.company(),
                website=self.faker.url(),
                about=self.faker.paragraph_with_max_length(max_length=1000),
            )
    
    def seed_employers(self):
        '''Seeding the employers'''
        companies = Company.objects.all()
        for i in range(self.EMPLOYER_COUNT):

            random_company = random.choice(companies)

            employer = Employer.objects.create(
                email=self.generate_unique_email(),
                first_name=self.faker.first_name(),
                last_name=self.faker.last_name(),
                other_names='bean + cheese + begel',
                phone_number=self.faker.phone_number(),
                company=random_company,
                is_company_admin=self.faker.boolean(),
            )
            employer.set_password(self.PASSWORD)
            employer.save()
    
    def seed_comapny_admins(self):
        '''Guarantee that each company has an admin'''
        for company in Company.objects.all():
            employer = Employer.objects.create(
                email=self.generate_unique_email(),
                first_name=self.faker.first_name(),
                last_name=self.faker.last_name(),
                other_names='bean + cheese + begel',
                phone_number=self.faker.phone_number(),
                company=company,
                is_company_admin=True,
            )
            employer.set_password(self.PASSWORD)
            employer.save()
        
    def seed_jobs(self):
        '''Seeding the jobs'''
        jobs_created = 0

        with open('api/management/commands/job_descriptions.csv', 'r') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if jobs_created >= self.JOB_COUNT:
                    break
                
                new_address = self.seed_address()
                Job.objects.create(
                    title = row['Role'],
                    description = row['Job Description'] + "\nBenefits: " + row['Benefits'] + "\nSkills: " + row['Skills'] + "\nResponsibilities: " + row['Responsibilities'],
                    salary = random.randint(30000, 100000),
                    address = new_address,
                    job_type = random.choice([choice[0] for choice in Job.JobType.choices])
                )
    
    def seed_questions(self):
        '''Seeding the questions'''
        jobs = Job.objects.all()
        for i in range(self.QUESTION_COUNT):

            random_job = random.choice(jobs)

            Question.objects.create(
                question=self.faker.paragraph_with_max_length(max_length=400),
                job=random_job
            )

    def seed_employer_job_relationship(self):
        '''Seeding the employer job relationship'''
        employers = list(Employer.objects.all())
        jobs = list(Job.objects.all())
        
        for i, job in enumerate(jobs):

            random_employer = random.choice(employers)

            EmployerJobRelation.objects.create(employer=random_employer, job=job)

    def seed_applications(self):
        '''Seeding the applications'''
        job_seekers = JobSeeker.objects.all()
        jobs = Job.objects.all()
        created_applications = set() 
        for i in range(self.APPLICATION_COUNT):

            while True:
                random_job_seeker = random.choice(job_seekers)
                random_job = random.choice(jobs)
                application_key = (random_job_seeker.id, random_job.id)
                if application_key not in created_applications:
                    
                    created_applications.add(application_key)
                    break

            Application.objects.create(
                job_seeker=random_job_seeker,
                resume=random_job_seeker.resume,
                job=random_job
            )
    
    def seed_answers(self):
        '''Seeding the answers'''
        applications = list(Application.objects.all())
        for i in range(self.APPLICATION_COUNT):

            application = random.choice(applications)
            applications.remove(application)

            job = application.job
            questions = Question.objects.filter(job=job)

            for question in questions:

                Answer.objects.create(
                    application=application,
                    question=question,
                    answer=self.faker.paragraph_with_max_length(max_length=400)
                )