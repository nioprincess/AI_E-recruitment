from rest_framework import viewsets
from job_management.models import Job
from job_management.serializers import JobSerializer
from user_management.permissions import IsRecruiter, IsAdmin
from file_management.tasks import save_job_attachment, save_job_application_attachment
from company_management.models import Company
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework import permissions
from user_management.permissions import IsAdmin, IsRecruiter
from file_management.tasks import (
    save_job_attachment,
    update_job_attachment,
    delete_job_attachment,
    delete_file,
)
from rest_framework.exceptions import PermissionDenied, ValidationError
from notification_management.tasks import send_notification
from .models import Application
from .serializers import ApplicationSerializer
from rest_framework.parsers import MultiPartParser
import json
from job_management.models import ApplicationStage
from django.utils import timezone
from django.db import transaction
from ai_agent_management.tasks import screen_candidates_applications


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ["list"]:

            permission_classes = []
        elif self.action in ["retrieve", "my_jobs", "update", "patch"]:
            permission_classes = [permissions.IsAuthenticated]

        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        user = self.request.user
        company = Company.objects.filter(c_admin=user).first()
        if not company:
            raise PermissionDenied(
                "You are not allowed to create a job for any company."
            )

        data = self.request.data.dict()
        attachments = self.request.FILES.getlist("j_attachments")

        data.pop("j_attachments", None)
        data["u_id"] = user.id
        data["c_id"] = company.id

        serializer = JobSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        job = serializer.save()

        if len(attachments) > 5:
            raise ValidationError("You can only upload a maximum of 5 attachments.")

        allowed_types = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]
        for file in attachments:
            if file.content_type not in allowed_types:
                raise ValidationError(
                    f"File type '{file.content_type}' is not allowed."
                )

            save_job_attachment.delay(
                file_data_bytes=file.read(),
                file_name=file.name,
                file_type=file.content_type,
                file_size=file.size,
                user_id=user.id,
                company_id=company.id,
                category="job_attachment",
                job_id=job.id,
            )
        send_notification.delay(
            message=f"New Job '{job.j_title}' posted from {company.c_description}  ",
            n_type="job_creation",
            is_read=False,
            c_id=company.id,
            user_id=user.id,
            broadcast=True,
        )

        return Response(
            {
                "success": True,
                "data": JobSerializer(job).data,
                "message": "Job created successfully (attachments will be processed)",
            },
            status=201,
        )

    def create(self, request, *args, **kwargs):
        user = self.request.user
        company_id = Company.objects.filter(c_admin=user).first().id
        if not company_id:
            return Response(
                {
                    "success": False,
                    "message": "You are not authorized to create a job for this company",
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        data = request.data.dict()

        data["u_id"] = user.id
        data["c_id"] = company_id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                "success": True,
                "data": serializer.data,
                "message": "Job created successfully",
            },
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                "success": True,
                "data": serializer.data,
                "message": "Jobs fetched successfully",
            }
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(
            {
                "success": True,
                "data": serializer.data,
                "message": "Job fetched successfully",
            }
        )

    def perform_update(self, serializer):
        user = self.request.user
        company = Company.objects.filter(c_admin=user).first()
        if not company:
            return Response(
                {
                    "success": False,
                    "message": "You are not authorized to update this job",
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        data = self.request.data.copy()
        if self.request.FILES:
            return Response(
                {
                    "success": False,
                    "message": "j_attachments cannot be updated directly",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save(u_id=user, c_id_id=company.id)

        return Response(
            {
                "success": True,
                "data": serializer.data,
                "message": "Job updated successfully",
            },
            status=status.HTTP_200_OK,
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        data = request.data

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {
                "success": True,
                "data": serializer.data,
                "message": "Job updated successfully",
            }
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        company_id = Company.objects.filter(c_admin=user).first()
        job = Job.objects.filter(id=instance.id, c_id=company_id).first()
        if not job:
            return Response(
                {
                    "success": False,
                    "message": "You are not authorized to delete this job",
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        if instance.j_attachments.exists():
            for attachment in instance.j_attachments.all():
                delete_file.delay(file_id=attachment.id)
        self.perform_destroy(instance)
        return Response(
            {"success": True, "message": "Job deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="my_jobs",
    )
    def my_jobs(self, request):
        try:
            user = request.user
            companies = Company.objects.filter(c_admin=user)
            jobs = Job.objects.filter(c_id__in=companies)
            print(jobs)
            serializer = JobSerializer(jobs, many=True)

            return Response(
                {
                    "success": True,
                    "message": "Jobs retrieved successfully",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return Response(
                {"success": False, "message": f"{e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="add-job-attachment",
    )
    def add_job_attachment(self, request):
        user = request.user
        job_id = request.query_params.get("job_id")
        if not job_id:
            return Response(
                {"success": False, "message": "Job ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        job = Job.objects.filter(id=job_id, u_id=user).first()
        if not job:
            return Response(
                {
                    "success": False,
                    "message": "You are not authorized to add attachments to this job",
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        files = request.FILES.getlist("j_attachments")
        if not files:
            return Response(
                {"success": False, "message": "At least one file is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(files) > 5:
            return Response(
                {
                    "success": False,
                    "message": "You can only upload a maximum of 5 attachments",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        allowed_types = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]
        for file in files:
            if file.content_type not in allowed_types:
                return Response(
                    {
                        "success": False,
                        "message": f"File type '{file.content_type}' is not allowed",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            save_job_attachment.delay(
                file_data_bytes=file.read(),
                file_name=file.name,
                file_type=file.content_type,
                file_size=file.size,
                user_id=user.id,
                company_id=job.c_id.id,
                category="job_attachment",
                job_id=job.id,
            )
        return Response(
            {"success": True, "message": "Job attachments added successfully"},
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=False,
        methods=["patch"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="update-job-attachment",
    )
    def update_job_attachment(self, request):
        user = request.user
        job_id = request.query_params.get("job_id")
        file_id = request.query_params.get("file_id")

        if not job_id or not file_id:
            return Response(
                {"success": False, "message": "Job ID and File ID are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        job = Job.objects.filter(id=job_id, u_id=user).first()
        if not job:
            return Response(
                {
                    "success": False,
                    "message": "You are not authorized to update this job attachment",
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        file = job.j_attachments.filter(id=file_id).first()
        if not file:
            return Response(
                {"success": False, "message": "File not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        new_file = request.FILES.get("file")
        if not new_file:
            return Response(
                {"success": False, "message": "New file is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        update_job_attachment.delay(
            file_id=file.id,
            new_file_data_bytes=new_file.read(),
            new_file_name=new_file.name,
            new_file_type=new_file.content_type,
            new_file_size=new_file.size,
            job_id=job.id,
        )
        return Response(
            {"success": True, "message": "Job attachment updated successfully"},
            status=status.HTTP_200_OK,
        )

    @action(
        detail=False,
        methods=["delete"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="delete-job-attachment",
    )
    def delete_job_attachment(self, request):
        user = request.user
        job_id = request.query_params.get("job_id")
        file_id = request.query_params.get("file_id")
        if not job_id or not file_id:
            return Response(
                {"success": False, "message": "Job ID and File ID are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        job = Job.objects.filter(id=job_id, u_id=user).first()
        if not job:
            return Response(
                {
                    "success": False,
                    "message": "You are not authorized to delete this job attachment",
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        file = job.j_attachments.filter(id=file_id).first()
        if not file:
            return Response(
                {"success": False, "message": "File not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        delete_job_attachment.delay(file_id=file.id, job_id=job.id)
        return Response(
            {"success": True, "message": "Job attachment deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="my-applications",
    )
    def my_applications(self, request):
        print("applications requested")
        user = request.user

        applications = Application.objects.filter(u_id=user)
        print(applications)

        serializer = ApplicationSerializer(applications, many=True)
        return Response(
            {
                "success": True,
                "data": serializer.data,
                "message": "Applications fetched successfully.",
            }
        )

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="all-applications",
    )
    def all_applications(self, request):
        print("applications requested")
        user = request.user

        applications = Application.objects.filter(j_id__c_id__c_admin=user)
        print(applications)

        serializer = ApplicationSerializer(applications, many=True)
        return Response(
            {
                "success": True,
                "data": serializer.data,
                "message": "Applications fetched successfully.",
            }
        )

    @action(
        detail=True,
        methods=["get"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="applications",
    )
    def list_applications(self, request, pk=None):
        job = self.get_object()
        user = request.user

        if user.u_role in ["recruiter", "admin"]:
            applications = Application.objects.filter(j_id=job.id)
        else:
            applications = Application.objects.filter(j_id=job.id, u_id=user.id)

        serializer = ApplicationSerializer(applications, many=True)
        return Response(
            {
                "success": True,
                "data": serializer.data,
                "message": "Applications fetched successfully.",
            }
        )

    @action(
        detail=False,
        methods=["patch"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="applications-screen-ai",
    )
    def screen_with_ai(self, request):
        application_ids = request.data.get("applications", [])
        screen_candidates_applications.delay(application_ids)
        return Response(
            {
                "success": True,
                 
                "message": "Please wait while applications are being screened.",
            }
        )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
        parser_classes=[MultiPartParser],
        url_path="submit-applications",
    )
    def submit_application(self, request, pk=None):

        job = self.get_object()
        user = request.user

        if Application.objects.filter(j_id=job.id, u_id=user.id).exists():
            return Response(
                {"success": False, "message": "You have already applied for this job."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        file = request.FILES.get("a_cover_letter")
        if not file:
            return Response(
                {"success": False, "message": "Application cover letter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = request.data.copy()
        data["u_id"] = user.id
        data["j_id"] = job.id
        data["status"] = "submitted"

        serializer = ApplicationSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        app = serializer.save()
        applicationStage = ApplicationStage.objects.create(
            a_id=app,
            s_name=app.status,
            s_started_at=app.created_at,
            s_completed=False,
            s_notes="Application submitted",
        )
        applicationStage.save()

        save_job_application_attachment.delay(
            file_data_bytes=file.read(),
            file_name=file.name,
            file_type=file.content_type,
            file_size=file.size,
            user_id=user.id,
            category="application_letter",
            application_id=app.id,
        )

        send_notification.delay(
            message=f"{user.u_first_name} applied for Job '{job.j_title}'",
            n_type="job_application",
            is_read=False,
            user_id=user.id,
            broadcast=False,
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
                "message": "Job application submitted successfully.",
            },
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["delete"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="applications/(?P<app_id>[^/.]+)",
    )
    def delete_application(self, request, pk=None, app_id=None):
        job = self.get_object()
        user = request.user
        app = Application.objects.filter(id=app_id, j_id=job.id).first()

        if not app:
            return Response(
                {"success": False, "message": "Application not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if user.u_role not in ["recruiter", "admin"] and app.u_id != user.id:
            raise PermissionDenied("You are not allowed to delete this application.")

        if app.a_cover_letter:
            delete_file.delay(file_id=app.a_cover_letter.id)

        app.delete()
        return Response(
            {"success": True, "message": "Application deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )

    @action(
        detail=True,
        methods=["patch"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="applications-status/(?P<app_id>[^/.]+)",
    )
    def change_application_status(self, request, pk=None, app_id=None):
       with transaction.atomic():
            job = self.get_object()
            user = request.user
            app = Application.objects.filter(id=app_id, j_id=job.id).first()

            if not app:
                return Response(
                    {"success": False, "message": "Application not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            if user.u_role not in ["recruiter", "admin"] and app.u_id != user.id:
                raise PermissionDenied("You are not allowed to update this application.")

            new_status = request.data.get("status")
            status_notes = request.data.get("notes", "")

            # update the application status
            app.status = new_status
            app.save()

            # get most recent stage for this application
            recent_stage = (
                ApplicationStage.objects.filter(a_id=app.id).order_by("-created_at").first()
            )

            # only update stages if new status is different
            if not recent_stage or recent_stage.s_name != new_status:
                # close all currently active (uncompleted) stages
                ApplicationStage.objects.filter(a_id=app.id, s_completed=False).update(
                    s_completed=True, s_ended_at=timezone.now()
                )

                # try to find an existing stage with same name
                same_stage = (
                    ApplicationStage.objects.filter(a_id=app.id, s_name=new_status)
                    .order_by("-created_at")
                    .first()
                )

                if same_stage:
                    # reactivate existing stage
                    same_stage.s_completed = False
                    same_stage.s_ended_at = None
                    same_stage.s_started_at = timezone.now()
                    same_stage.s_notes = status_notes
                    same_stage.save()
                else:
                    # create a new stage
                    ApplicationStage.objects.create(
                        a_id=app,
                        s_name=new_status,
                        s_started_at=timezone.now(),
                        s_completed=False,
                        s_notes=status_notes,
                    )

            return Response(
                {
                    "success": True,
                    "message": "Application status updated successfully.",
                    "data": {"status": app.status},
                },
                status=status.HTTP_200_OK,
            )