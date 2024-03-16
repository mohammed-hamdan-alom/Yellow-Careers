from api.models import Job, JobSeeker, Application
from Levenshtein import ratio
from gensim.models import Word2Vec
from nltk.tokenize import word_tokenize
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import os


LOCATION_WEIGHTING = 0
LEVENSHTEIN_WEIGHTING = 0.3
WORD2VEC_WEIGHTING = 0.7

model = Word2Vec.load("api/matchmaker/word2vec_model_all2.bin")

def getMatchedJobsForJobSeeker (job_seeker):
    resume = job_seeker.get_resume().to_string()
    job_scores = {}
    for job in Job.objects.all():
        job_description = job.to_string()
        job_scores[job] = (
            LOCATION_WEIGHTING*calculateLocationScore(job, job_seeker) +
            LEVENSHTEIN_WEIGHTING*calculateLevenshteinScore(job_description, resume) +
            WORD2VEC_WEIGHTING*calculateWord2VecSimilarity(job_description, resume)
            )
        
    matched_order = sorted(job_scores.items(), key=lambda x: x[1], reverse=True)
    matched_jobs = [item[0] for item in matched_order]
    applications = Application.objects.filter(job_seeker=job_seeker)
    applied_jobs = [application.job for application in applications]
    return list(filter(lambda x: x not in applied_jobs, matched_jobs))
    # return Job.objects.exclude(id__in=[job.id for job in applied_jobs])

def getMatchedApplicantsForJob(job,applicants):
    job_description = job.to_string()
    applicant_scores = {}
    for job_seeker in applicants:
        resume = job_seeker.get_resume().to_string()
        applicant_scores[job_seeker] = (
            LOCATION_WEIGHTING*calculateLocationScore(job, job_seeker) +
            LEVENSHTEIN_WEIGHTING*calculateLevenshteinScore(job_description, resume) +
            WORD2VEC_WEIGHTING*calculateWord2VecSimilarity(job_description, resume)
            )
        
    matched_order = sorted(applicant_scores.items(), key=lambda x: x[1], reverse=True)
    matched_applicants = [item[0] for item in matched_order]
    return matched_applicants

def calculateLocationScore (job, job_seeker):
    job_location = job.address
    job_seeker_location = job_seeker.address
    score = 0
    if job_location.country.lower() == job_seeker_location.country.lower():
        score = 1

    if job_location.city.lower() != job_seeker_location.city.lower():
        score = score*0.7
    return score
    

def calculateLevenshteinScore(job_description, resume):
    return ratio(job_description, resume)

def calculateAverageWordEmbedding (text):
    tokens = word_tokenize(text.lower())  # Tokenize and lowercase the text
    embeddings = [model.wv[word] for word in tokens if word in model.wv]  # Get word embeddings for valid words
    if embeddings:
        return np.mean(embeddings, axis=0)  # Calculate the average word embedding
    else:
        return np.zeros(model.vector_size)  # Return zero vector if no valid words found

def calculateWord2VecSimilarity (job_description, resume):
    resume_embedding = calculateAverageWordEmbedding(resume)
    job_embedding = calculateAverageWordEmbedding(job_description)
    # 1 = perfect similarity, 0 = no similarity, -1 = perfect dissimilarity
    similarity = cosine_similarity([resume_embedding], [job_embedding])[0][0]  # Calculate cosine similarity
    return (similarity+1)/2  # Normalize to 0-1 range

