import cloudinary.uploader
from celery import shared_task
from .models import File
from io import BytesIO
from user_management.models import Profile,   Cv
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
import os
import pymupdf
import re
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
from docx import Document
from job_management.models import Job, Application

User = get_user_model()


def get_docx_content(file_path):
    try:
        doc = Document(file_path)
        return "\n".join(paragraph.text for paragraph in doc.paragraphs if paragraph.text.strip())

    except Exception as e:
        return f"Error extracting DOCX content: {str(e)}"
def get_pdf_content(file_path):
    try:
         

        doc = pymupdf.open(file_path)
        return "\n".join(page.get_text() for page in doc)

    except Exception as e:
        return f"Error extracting PDF content: {str(e)}"
def clean_text(text):
    text = text.lower()

    text = re.sub(r'\S+@\S+', '', text)             
    text = re.sub(r'http\S+', '', text)              
    text = re.sub(r'[^a-z\s]', ' ', text)            
    text = re.sub(r'\d+', '', text)                 

    words = text.split()

    stop_words = set(stopwords.words('english')).union(ENGLISH_STOP_WORDS)
    words = [w for w in words if w not in stop_words and len(w) > 2]

    return ' '.join(words)

@shared_task
def upload_file_and_save(file_data_bytes, file_name, file_type, file_size, user_id=None, company_id=None, category='p_picture'):
    try:
        file_obj = BytesIO(file_data_bytes)
        file_obj.name = file_name

        upload_result = cloudinary.uploader.upload(file_obj)

        file = File.objects.create(
            u_id_id=user_id,
            c_id_id=company_id,
            f_name=file_name,
            f_url=upload_result['secure_url'],
            f_type=file_type,
            f_size=file_size,
            f_category=category,
            f_public_id=upload_result.get('public_id', None),
            f_format=upload_result.get('format', None),
            f_resource_type=upload_result.get('resource_type', None)
        )
        user_profile=  Profile .objects.get(u_id_id=user_id)
        user= User.objects.get(id=user_id)

        if user_profile:
            if category == 'p_picture':
                user_profile.p_picture = file
            elif category == 'p_cover_picture':
                user_profile.p_cover_picture = file
            user.u_profile = user_profile
            user.save()
            user_profile.save()
        else:
            return f"User profile not found for user ID: {user_id}"
        
            
        return f"Uploaded and saved file ID: {file.id}"

    except Exception as e:
        return f"Failed to upload: {str(e)}"
    

@shared_task
def delete_file(file_id):
    try:
        file = File.objects.get(id=file_id)
        if file.f_url and file.f_public_id:
            cloudinary.uploader.destroy(file.f_public_id)
        if file.f_path and file.f_path.path and os.path.isfile(file.f_path.path):
            os.remove(file.f_path.path)
        file.delete()
        return f"File with ID {file_id} deleted successfully."
    except File.DoesNotExist:
        return f"File with ID {file_id} does not exist."
    except Exception as e:
        return f"Failed to delete file: {str(e)}"



@shared_task
def update_file(file_id, new_file_data_bytes, new_file_name, new_file_type, new_file_size, category="cv"):
    try:
        file = File.objects.get(id=file_id)
        new_file_obj = BytesIO(new_file_data_bytes)
        new_file_obj.name = new_file_name


        if file.f_url:
             cloudinary.uploader.upload(new_file_obj, public_id=file.f_public_id, overwrite=True)

        if file.f_path and file.f_path.path and category == "cv":
            
            content_file = ContentFile(new_file_data_bytes, name=new_file_name)
            user_id=file.u_id.id
            os.remove(file.f_path.path)
            file.delete()
            
            cv_file= File.objects.create(
                        u_id_id=user_id,
                        c_id_id=None,
                        f_name=new_file_name,
                        f_url='',
                        f_path=content_file,
                        f_type=new_file_type,
                        f_size=new_file_size,
                        f_category=category,
                        f_public_id=new_file_name,
                        f_format=None,
                        f_resource_type=None
                )
            cv= Cv.objects.filter(user_id=user_id).first()
            if cv:
                cv.c_f_id = cv_file
               

            if new_file_type == "application/pdf":
                pdf_content = clean_text(get_pdf_content(cv_file.f_path.path))
                cv.c_content = pdf_content.strip()
            if new_file_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                docx_content = get_docx_content(cv_file.f_path.path)
                cv.c_content = clean_text(docx_content).strip()
            
            cv.save()
        return f"File with ID {file_id} updated successfully."
    except File.DoesNotExist:
        return f"File with ID {file_id} does not exist."
    except Exception as e:
        return f"Failed to update file: {str(e)}"
    
@shared_task
def save_cv_file(file_data_bytes, file_name, file_type, file_size, user_id=None, company_id=None, category='p_picture'):
    content_file = ContentFile(file_data_bytes, name=file_name)
    cv_file= File.objects.create(
            u_id_id=user_id,
            c_id_id=company_id,
            f_name=file_name,
            f_url='',
            f_path=content_file,
            f_type=file_type,
            f_size=file_size,
            f_category=category,
            f_public_id=file_name,
            f_format=None,
            f_resource_type=None
        )
    cv= Cv.objects.filter(user_id=user_id).first()
    if cv:
        cv.c_f_id = cv_file
    if file_type == "application/pdf":
        pdf_content = clean_text(get_pdf_content(cv_file.f_path.path))
        cv.c_content = pdf_content.strip()
    if file_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        docx_content = get_docx_content(cv_file.f_path.path)
        cv.c_content = clean_text(docx_content).strip()
    cv.save()
    
    return f"File '{file_name}' saved successfully"





@shared_task
def save_job_attachment(file_data_bytes, file_name, file_type, file_size, user_id=None, company_id=None, job_id=None, category='job_attachment'):
    if not job_id and not user_id:
        return "Job ID and User ID are required to save job attachments."
    content_file=ContentFile(file_data_bytes, name=file_name)
    file = File.objects.create(
          u_id_id=user_id,
            c_id_id=None,
            f_name=file_name,
            f_url='',
            f_path=content_file,
            f_type=file_type,
            f_size=file_size,
            f_category=category,
            f_public_id=file_name,
            f_format=None,
            f_resource_type=None
        
    )
    job= Job.objects.filter(id=job_id).first()
    if job:
        job.j_attachments.add(file)
        job.save()
    else:
        return f"Job with ID {job_id} does not exist."
    return file.id



@shared_task
def save_job_application_attachment(file_data_bytes, file_name, file_type, file_size, user_id=None, application_id=None, job_id=None, category='job_attachment'):
    if not job_id and not user_id:
        return "Job ID and User ID are required to save job attachments."
    content_file=ContentFile(file_data_bytes, name=file_name)
    file = File.objects.create(
          u_id_id=user_id,
            c_id_id=None,
            f_name=file_name,
            f_url='',
            f_path=content_file,
            f_type=file_type,
            f_size=file_size,
            f_category=category,
            f_public_id=file_name,
            f_format=None,
            f_resource_type=None
        
    )
    application= Application.objects.filter(id=application_id).first()
    if application:
        application.a_cover_letter=file
        application.save()
    else:
        return f"Job application with ID {job_id} does not exist."
    return file.id

@shared_task
def delete_job_attachment(file_id, job_id):
    try:
        file = File.objects.get(id=file_id)
        job = Job.objects.get(id=job_id)
        if file in job.j_attachments.all():
            job.j_attachments.remove(file)
            file.delete()
            return f"File with ID {file_id} deleted from job with ID {job_id}."
        else:
            return f"File with ID {file_id} is not attached to job with ID {job_id}."
    except File.DoesNotExist:
        return f"File with ID {file_id} does not exist."
    except Job.DoesNotExist:
        return f"Job with ID {job_id} does not exist."
    except Exception as e:
        return f"Failed to delete file: {str(e)}"
@shared_task 
def update_job_attachment(file_id, new_file_data_bytes, new_file_name, new_file_type, new_file_size, job_id):
    try:
        file = File.objects.get(id=file_id)
        new_file_obj = BytesIO(new_file_data_bytes)
        new_file_obj.name = new_file_name
        job= Job.objects.get(id=job_id)
 

        if file.f_path and file.f_path.path and file in job.j_attachments.all():
            
            content_file = ContentFile(new_file_data_bytes, name=new_file_name)
            user_id=file.u_id.id
            os.remove(file.f_path.path)
            job.j_attachments.remove(file)
            file.delete()
            
            new_file= File.objects.create(
                        u_id_id=user_id,
                        c_id_id=None,
                        f_name=new_file_name,
                        f_url='',
                        f_path=content_file,
                        f_type=new_file_type,
                        f_size=new_file_size,
                        f_category="job_attachment",
                        f_public_id=new_file_name,
                        f_format=None,
                        f_resource_type=None
                )
 
            
            job.j_attachments.add(new_file)
            job.save()

        return f"File with ID {file_id} updated successfully."
    except File.DoesNotExist:
        return f"File with ID {file_id} does not exist."
    except Exception as e:
        return f"Failed to update file: {str(e)}"

