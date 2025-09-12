from celery import shared_task
import time

@shared_task
def process_candidate(candidate_id):
    # Simulate long task
    time.sleep(30)
    return f"Candidate {candidate_id} processed after a long delay"
