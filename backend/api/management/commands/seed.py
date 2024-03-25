import random
from django.core.management.base import BaseCommand, CommandError
from faker import Faker
from api.models import User, JobSeeker, Employer, Job, Application, Resume, SoftSkill, TechnicalSkill, Language, Education, ProfessionalExperience, Address, Company, Question, Answer, EmployerJobRelation
from faker.providers import BaseProvider
from halo import Halo
import csv

#TODO: SHOULD MOVE TO SEPERATE FILES
job_seeker_fixture = [
    {
        'email': 'john.doe@example.com',
        'first_name': 'John',
        'last_name': 'Doe',
        'other_names': 'Smith',
        'phone_number': '+1234567890',
        'dob': '1990-01-01',
        'address': {
            'city': 'York',
            'post_code': '10001',
            'country': 'United Kingdom'
        },
        'nationality': 'British',
        'sex': 'M',
    }
]

resume_fixture = [
    {
        'github': 'https://github.com/test',
        'linkedin': 'https://linkedin.com/test',
        'about': "I am a seasoned software engineer with a strong foundation in SQL database management and a meticulous approach to ensuring data integrity. Over the past 5 years, I've specialized in architecting and optimizing SQL databases, crafting robust schemas, and fine-tuning queries for optimal performance. My expertise extends to maintaining databases, implementing rigorous data validation processes, and establishing comprehensive backup and recovery strategies to safeguard critical information. In addition to database management, I possess advanced skills in web development, particularly in leveraging the Django framework to build scalable and responsive applications. My commitment to excellence and attention to detail are evident in the systems I develop, which prioritize security, reliability, and maintainability.",
        'experience': "Throughout my career, I've played a pivotal role in developing and maintaining mission-critical software solutions. As a software engineer, I've led initiatives to design and implement SQL databases that serve as the backbone of enterprise applications. I have a proven track record of optimizing database performance, reducing query execution times, and ensuring seamless scalability to accommodate growing data volumes. My experience also encompasses establishing robust data validation mechanisms to uphold data integrity standards and prevent unauthorized access or manipulation. Proficient in crafting intricate SQL queries, I specialize in extracting meaningful insights from complex datasets, driving informed decision-making across organizational levels. In tandem with database management, I've contributed to the development of Django-based web applications, delivering user-centric solutions that drive business growth and enhance user engagement. With a focus on continuous improvement, I thrive in dynamic environments where innovation and collaboration are paramount.",
    }
]

technical_skills = [
    {"skill": "Python"},
    {"skill": "SQL Database Management"},
    {"skill": "Database Administration"},
    {"skill": "Django Web Development"},
    {"skill": "Query Optimization"},
    {"skill": "Data Analysis"},
    {"skill": "Attention to Security"}
]

soft_skills = [
    {"skill": "Teamwork"},
    {"skill": "Problem-Solving"},
    {"skill": "Attention to Detail"},
    {"skill": "Communication"},
    {"skill": "Adaptability"},
    {"skill": "Time Management"},
    {"skill": "Customer Focus"}
]

languages = [
    {
        "language": "English",
        "spoken_proficiency": "F",
        "written_proficiency": "F",
    }
]

educations = [
    {
        "course_name": "Computer Science",
        "start_date": "2011-09-01",
        "end_date": "2015-06-01",
        "address": {
            "city": "London",
            "post_code": "WC2B 4BG",
            "country": "United Kingdom"
        },
        "level": "BA",
        "institution": "Kings College London",
        "grade": "First",
    },
    {
        "course_name": "Data Science",
        "start_date": "2015-09-01",
        "end_date": "2016-06-01",
        "address": {
            "city": "London",
            "post_code": "WC2B 4BG",
            "country": "United Kingdom"
        },
        "level": "MA",
        "institution": "Kings College London",
        "grade": "First",
    }
]

professional_experiences = [
    {
        "start_date": "2013-06-01",
        "end_date": "2013-08-01",
        "address": {
            "city": "London",
            "post_code": "WC2B 4BG",
            "country": "United Kingdom"
        },
        "company": "IBM",
        "position": "Software Developer Internship",
        "description": "Developed and tested software solutions for enterprise clients. Assisted in database management and query optimization. Collaborated with senior developers to troubleshoot and resolve technical issues."
    },
    {
        "start_date": "2017-06-01",
        "end_date": "2019-06-01",
        "address": {
            "city": "London",
            "post_code": "WC2B 4BG",
            "country": "United Kingdom"
        },
        "company": "Google",
        "position": "Software Engineer",
        "description": "Developed and maintained SQL databases for enterprise applications. Optimized query performance and data integrity. Led initiatives to establish robust data validation processes and backup strategies.",
    }
]

employer_fixture = [
    {
        'email': 'jane.doe@example.com',
        'first_name': 'Jane',
        'last_name': 'Doe',
        'other_names': 'Elizabeth',
        'phone_number': '+1234567890',
        "is_company_admin": True,
    }
]
              
jobs = [
    {
        "job_info":{
            "title":"Database Developer",
            "description" : "A Database Developer designs, develops, and maintains databases. They create efficient data structures, write queries, and ensure data security and integrity. Benefits: Tuition Reimbursement, Stock Options or Equity Grants, Parental Leave, Wellness Programs, Childcare Assistance Skills: Database design and development SQL and database querying Data modeling Programming languages (e.g., Java, Python) Data security and privacy regulations knowledge Responsibilities: Design and implement database systems, tables, and structures. Develop and optimize SQL queries and scripts. Ensure data security, integrity, and backup procedures.",
            "salary": 80000,
            "address": {
                "city": "London",
                "post_code": "WC2B 4BG",
                "country": "United Kingdom"
            },
            "job_type": "FT"
        },
        "questions":[
            {"question" : "Can you provide examples of your experience in designing and implementing database systems, tables, and structures?"},
            {"question" : "How do you ensure data security, integrity, and backup procedures in the databases you develop?"},
            {"question" : "Have you worked with any specific data security and privacy regulations? If so, can you provide examples of how you implemented them in your projects?"}
        ]
    },
    {
        "job_info":{
            "title":"SQL Database Developer",
            "description": "SQL Database Developers design, implement, and maintain relational databases using SQL (Structured Query Language). They write queries, optimize database performance, and ensure data integrity and security. Benefits: Employee Assistance Programs (EAP), Tuition Reimbursement, Profit-Sharing, Transportation Benefits, Parental Leave. Skills: SQL (Structured Query Language) Database design Query optimization Data modeling Database maintenance Problem-solving skills Responsibilities: Design, develop, and maintain SQL databases, ensuring data integrity and performance. Write complex SQL queries and stored procedures. Troubleshoot database issues and optimize queries.",
            "salary": 90000,
            "address": {
                "city": "London",
                "post_code": "WC2B 4BG",
                "country": "United Kingdom"
            },
            "job_type": "PT"
        },
        "questions":[
            {"question" : "Have you encountered any challenges in troubleshooting database issues, and how did you resolve them?"},
            {"question" : "Are you comfortable working in a part-time capacity, and how do you manage your workload and priorities in this arrangement?"},
            {"question" : "What measures do you take to ensure data quality and reliability within SQL databases, especially when handling large datasets or sensitive information?"}
        ]
    },
    {
        "job_info":{
            "title": "Data Analyst",
            "description" : "Analyze data sets, generate insights, and provide data-driven recommendations to inform business decisions. Benefits: Health Insurance, Retirement Plans, Paid Time Off (PTO), Flexible Work Arrangements, Employee Assistance Programs (EAP) Skills: Data analysis tools (e.g., SQL, Python) Data visualization tools (e.g., Tableau, Power BI) Statistical analysis Data cleansing and transformation Data modeling Communication of data insights Problem-solving Attention to detail Business acumen. Responsibilities: Analyze marketing data to measure campaign performance and ROI. Provide insights for marketing strategy adjustments. Create data visualizations and dashboards. ",
            "salary": 70000,
            "address": {
                "city": "London",
                "post_code": "WC2B 4BG",
                "country": "United Kingdom"
            },
            "job_type": "FT"
        },
        "questions":[
            {"question" : "What experience do you have in analyzing data sets to generate actionable insights and recommendations for business decision-making?"},
            {"question" : "How do you approach data modeling to identify trends, patterns, and correlations within datasets?" },
            {"question" : "Can you discuss your experience working in a fast-paced environment, and how you manage multiple projects and deadlines effectively?"}
        ]
    },
    {
        "job_info":{
        "title": "Frontend Web Developer",
        "description":"Frontend Web Developers design and implement user interfaces for websites, ensuring they are visually appealing and user-friendly. They collaborate with designers and backend developers to create seamless web experiences for users. Benefits: Health Insurance, Retirement Plans, Paid Time Off (PTO), Flexible Work Arrangements, Employee Assistance Programs (EAP). Skills: HTML, CSS, JavaScript Frontend frameworks (e.g., React, Angular) User experience (UX). Responsibilities: Design and code user interfaces for websites, ensuring a seamless and visually appealing user experience. Collaborate with UX designers to optimize user journeys. Ensure cross-browser compatibility and responsive design.",
            "salary": 30000,
            "address": {
                "city": "London",
                "post_code": "WC2B 4BG",
                "country": "United Kingdom"
            },
            "job_type": "IN"
        },
        "questions":[
            {"question" : "How proficient are you in HTML, CSS, and JavaScript, and can you discuss how you use these languages to build interactive and responsive web interfaces?"},
            {"question" : "Can you discuss any challenges you've encountered in frontend development projects and how you've overcome them?"},
            {"question" : "Can you provide examples of websites or web applications you've worked on where you played a key role in achieving a seamless and visually appealing user experience?"}
        ]
    }
]

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
    JOB_SEEKER_COUNT = RESUME_COUNT = 150
    EMPLOYER_COUNT = 50
    COMPANY_COUNT = 30
    JOB_COUNT = QUESTION_COUNT = 200 
    SOFT_SKILL_COUNT = TECHNICAL_SKILL_COUNT = LANGUAGE_COUNT = EDUCATION_COUNT = PROFFESSIONAL_EXPERIENCE_COUNT = 200
    EMPLOYER_JOB_RELATION_COUNT = 200
    APPLICATION_COUNT = 1000


    def __init__(self):
        super().__init__()
        self.faker = Faker('en_GB')
        self.faker.add_provider(CustomWordProvider)

    @Halo(text='Seeding the database', spinner='dots')
    def handle(self, *args, **options):
        self.seed_resumes()
        self.seed_job_seeker_fixture()
        
        self.seed_job_seekers()
        self.seed_companies()
        self.seed_employers()
        self.seed_company_admins()
        self.seed_jobs()
        self.seed_questions()
        self.seed_employer_job_relationship()
        self.seed_employer_fixture()
        self.seed_applications()
        self.seed_answers()
    
    def seed_job_seeker_fixture(self):
        '''Seeding the fixtures'''
        resume = Resume.objects.create(
            github=resume_fixture[0]['github'],
            linkedin=resume_fixture[0]['linkedin'],
            about=resume_fixture[0]['about'],
            experience=resume_fixture[0]['experience'],
        )

        for skill in soft_skills:
            SoftSkill.objects.create(skill=skill['skill'], resume_id=resume.id)

        
        for skill in technical_skills:
            TechnicalSkill.objects.create(skill=skill['skill'], resume_id=resume.id)

        
        for language in languages:
            Language.objects.create(
                language=language['language'],
                spoken_proficiency=language['spoken_proficiency'],
                written_proficiency=language['written_proficiency'],
                resume_id = resume.id
            )
        for education in educations:
            address = Address.objects.create(**education['address'])
            Education.objects.create(
                course_name=education['course_name'],
                start_date=education['start_date'],
                end_date=education['end_date'],
                address=address,
                level=education['level'],
                institution=education['institution'],
                grade=education['grade'],
                resume_id=resume.id
            )

        for experience in professional_experiences:
            address = Address.objects.create(**experience['address'])
            ProfessionalExperience.objects.create(
                start_date=experience['start_date'],
                end_date=experience['end_date'],
                address=address,
                company=experience['company'],
                position=experience['position'],
                description=experience['description'],
                resume_id=resume.id
            )

        job_seeker = JobSeeker.objects.create(
            email=job_seeker_fixture[0]['email'],
            first_name=job_seeker_fixture[0]['first_name'],
            last_name=job_seeker_fixture[0]['last_name'],
            other_names=job_seeker_fixture[0]['other_names'],
            phone_number=job_seeker_fixture[0]['phone_number'],
            dob=job_seeker_fixture[0]['dob'],
            address=Address.objects.create(**job_seeker_fixture[0]['address']),
            nationality=job_seeker_fixture[0]['nationality'],
            sex = job_seeker_fixture[0]['sex'],
            resume_id=resume.id,
            is_superuser=True,
            is_staff=True
        )
        job_seeker.set_password(self.PASSWORD)
        job_seeker.save()

    def seed_employer_fixture(self):
        '''Seeding the employer fixture'''
        company = Company.objects.create(
            company_name='Yellow Careers',
            website='https://yellow-careers.vercel.app/',
            about='Yellow Careers is a platform that connects job seekers with employers. We aim to make the job search process as seamless as possible.',
        )

        main_employer = Employer.objects.create(
            email=employer_fixture[0]['email'],
            first_name=employer_fixture[0]['first_name'],
            last_name=employer_fixture[0]['last_name'],
            other_names=employer_fixture[0]['other_names'],
            phone_number=employer_fixture[0]['phone_number'],
            is_company_admin=employer_fixture[0]['is_company_admin'],
            company=company,
            is_superuser=True,
            is_staff=True,
        )
        main_employer.set_password(self.PASSWORD)
        main_employer.save()

        employers = []
        for i in range(3):
            employer = Employer.objects.create(
                email=self.generate_unique_email(),
                first_name=self.faker.first_name(),
                last_name=self.faker.last_name(),
                other_names=self.faker.first_name(),
                phone_number=self.faker.phone_number(),
                company=company,
                is_company_admin=False,
            )
            employer.set_password(self.PASSWORD)
            employer.save()
            employers.append(employer)

        new_jobs = []

        for job in jobs:
            info = job['job_info']
            new_address = Address.objects.create(**info['address'])
            new_job = Job.objects.create(
                title=info['title'],
                description=info['description'],
                salary=info['salary'],
                address=new_address,
                job_type=info['job_type']
            )
            new_jobs.append(new_job)

            for question in job['questions']:
                Question.objects.create(question=question['question'], job=new_job)

        EmployerJobRelation.objects.create(employer=main_employer, job=new_jobs[0])
        EmployerJobRelation.objects.create(employer=employers[2], job=new_jobs[0])
        EmployerJobRelation.objects.create(employer=employers[1], job=new_jobs[0])
        EmployerJobRelation.objects.create(employer=employers[0], job=new_jobs[1])
        EmployerJobRelation.objects.create(employer=employers[1], job=new_jobs[1])
        EmployerJobRelation.objects.create(employer=employers[1], job=new_jobs[2])
        EmployerJobRelation.objects.create(employer=main_employer, job=new_jobs[3])
        
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
                other_names=self.faker.first_name(),
                phone_number=self.faker.phone_number(),
                company=random_company,
                is_company_admin=self.faker.boolean(),
            )
            employer.set_password(self.PASSWORD)
            employer.save()
    
    def seed_company_admins(self):
        '''Guarantee that each company has an admin'''
        for company in Company.objects.all():
            employer = Employer.objects.create(
                email=self.generate_unique_email(),
                first_name=self.faker.first_name(),
                last_name=self.faker.last_name(),
                other_names=self.faker.first_name(),
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
                jobs_created += 1
    
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