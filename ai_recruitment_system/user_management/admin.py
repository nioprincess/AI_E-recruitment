from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User

class UserAdmin(BaseUserAdmin):
    list_display = ('u_email', 'u_first_name', 'u_middle_name','u_last_name', 'u_role', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'u_role')
    fieldsets = (
        (None, {'fields': ('u_email', 'u_password')}),
        (_('Personal info'), {'fields': ('u_first_name','u_middle_name', 'u_last_name')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'u_role', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'role'),
        }),
    )
    search_fields = ('u_email', 'u_first_name','u_middle_name', 'u_last_name')
    ordering = ('u_email',)

admin.site.register(User, UserAdmin)