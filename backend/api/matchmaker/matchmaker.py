from api.models import Application
from Levenshtein import ratio
from gensim.models import Word2Vec
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import string

LOCATION_WEIGHTING = 0.05
LEVENSHTEIN_WEIGHTING = 0.25
WORD2VEC_WEIGHTING = 0.7

model = Word2Vec.load("api/matchmaker/word2vec_model_all.bin")

# Custom tokenization function
def custom_tokenize(text):
    # Remove punctuation and split the text into tokens
    text = text.translate(str.maketrans('', '', string.punctuation))
    tokens = text.lower().split()
    return tokens

def getMatchedJobsForJobSeeker(job_seeker, jobs):
    """Returns a list of jobs in order of how well they match the job seeker's resume."""
    resume = job_seeker.get_resume().to_string()
    job_scores = {}
    for job in jobs:
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

def getMatchedApplicationsForJob(job, applications):
    """Returns a list of applications in order of how well they match the job description."""
    job_description = job.to_string()
    application_scores = {}
    for application in applications:
        resume = application.resume.to_string()
        application_scores[application] = (
            LOCATION_WEIGHTING * calculateLocationScore(job, application.job_seeker) +
            LEVENSHTEIN_WEIGHTING * calculateLevenshteinScore(job_description, resume) +
            WORD2VEC_WEIGHTING * calculateWord2VecSimilarity(job_description, resume)
        )
        
    matched_order = sorted(application_scores.items(), key=lambda x: x[1], reverse=True)
    matched_applications = [item[0] for item in matched_order]
    return matched_applications

def calculateLocationScore(job, job_seeker):
    """Returns a score between 0 and 1 based on the similarity of the job location and job seeker location."""
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
    """Returns a score between 0 and 1 based on the similarity of the job description and resume."""
    return ratio(job_description, resume)

def calculateAverageWordEmbedding(text):
    """Returns the average word embedding of the text."""
    tokens = custom_tokenize(text)
    embeddings = [model.wv[word] for word in tokens if word in model.wv]
    if embeddings:
        return np.mean(embeddings, axis=0)
    else:
        return np.zeros(model.vector_size)

def calculateWord2VecSimilarity(job_description, resume):
    """Returns a score between 0 and 1 based on the similarity of the job description and resume."""
    resume_embedding = calculateAverageWordEmbedding(resume)
    job_embedding = calculateAverageWordEmbedding(job_description)
    similarity = cosine_similarity([resume_embedding], [job_embedding])[0][0]
    return (similarity + 1) / 2

