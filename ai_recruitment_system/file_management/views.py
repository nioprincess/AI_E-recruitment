from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import FileResponse
from user_management.models import Cv
from .models import File
from job_management.models import Job
import os

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_cv_file(request, cv_id):
    try:
        cv = Cv.objects.get(id=cv_id, user_id=request.user)

        if not cv.c_f_id or not cv.c_f_id.f_path:
            return Response({'error': 'No file found for this CV.'}, status=404)

        file_path = cv.c_f_id.f_path.path
        filename = os.path.basename(file_path)

        response = FileResponse(open(file_path, 'rb'), as_attachment=True, filename=filename)
        return response

    except Cv.DoesNotExist:
        return Response({'error': 'CV not found or unauthorized access.'}, status=404)

    except FileNotFoundError:
        return Response({'error': 'File missing from disk.'}, status=410)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_job_attachment(request, file_id):
    try:
        file = File.objects.get(id=file_id)
    except File.DoesNotExist:
        return Response({'error': 'No file found for this CV.'}, status=404)

    job = Job.objects.filter(j_attachments__id=file.id).first()
    if not job:
        return Response({'success': False, 'message': 'This file is not linked to any job.'}, status=403)
    
    if job.u_id != request.user and request.user.u_role != 'admin':
        return Response({'success': False, 'message': 'Unauthorized'}, status=403)

    file_path = file.f_path.path
    if not os.path.exists(file_path):
        raise   Response({'error': 'No file found for this CV.'}, status=404)

    return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file.f_name)
