from api.models import Job, JobSeeker, Application
from Levenshtein import ratio
from gensim.models import Word2Vec
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import string

LOCATION_WEIGHTING = 0.05
LEVENSHTEIN_WEIGHTING = 0.3
WORD2VEC_WEIGHTING = 0.65

model = Word2Vec.load("api/matchmaker/word2vec_model_all.bin")

# Custom tokenization function
def custom_tokenize(text):
    # Remove punctuation and split the text into tokens
    text = text.translate(str.maketrans('', '', string.punctuation))
    tokens = text.lower().split()
    return tokens

def getMatchedJobsForJobSeeker(job_seeker):
    resume = job_seeker.get_resume().to_string()
    job_scores = {}
    for job in Job.objects.all():
        job_description = job.to_string()
        job_scores[job] = (
            LOCATION_WEIGHTING * calculateLocationScore(job, job_seeker) +
            LEVENSHTEIN_WEIGHTING * calculateLevenshteinScore(job_description, resume) +
            WORD2VEC_WEIGHTING * calculateWord2VecSimilarity(job_description, resume)
        )
        
    matched_order = sorted(job_scores.items(), key=lambda x: x[1], reverse=True)
    matched_jobs = [item[0] for item in matched_order]
    applications = Application.objects.filter(job_seeker=job_seeker)
    applied_jobs = [application.job for application in applications]
    return list(filter(lambda x: x not in applied_jobs, matched_jobs))

def getMatchedApplicantsForJob(job, applicants):
    job_description = job.to_string()
    applicant_scores = {}
    for job_seeker in applicants:
        resume = job_seeker.get_resume().to_string()
        applicant_scores[job_seeker] = (
            LOCATION_WEIGHTING * calculateLocationScore(job, job_seeker) +
            LEVENSHTEIN_WEIGHTING * calculateLevenshteinScore(job_description, resume) +
            WORD2VEC_WEIGHTING * calculateWord2VecSimilarity(job_description, resume)
        )
        
    matched_order = sorted(applicant_scores.items(), key=lambda x: x[1], reverse=True)
    matched_applicants = [item[0] for item in matched_order]
    return matched_applicants

def calculateLocationScore(job, job_seeker):
    try:
        job_location = job.address
        job_seeker_location = job_seeker.address
        score = 0
        if job_location.country.lower() == job_seeker_location.country.lower():
            score = 1

        if job_location.city.lower() != job_seeker_location.city.lower():
            score = score * 0.7
        return score
    except Exception:
        return 0

def calculateLevenshteinScore(job_description, resume):
    return ratio(job_description, resume)

def calculateAverageWordEmbedding(text):
    tokens = custom_tokenize(text)
    embeddings = [model.wv[word] for word in tokens if word in model.wv]
    if embeddings:
        return np.mean(embeddings, axis=0)
    else:
        return np.zeros(model.vector_size)

def calculateWord2VecSimilarity(job_description, resume):
    resume_embedding = calculateAverageWordEmbedding(resume)
    job_embedding = calculateAverageWordEmbedding(job_description)
    similarity = cosine_similarity([resume_embedding], [job_embedding])[0][0]
    return (similarity + 1) / 2

