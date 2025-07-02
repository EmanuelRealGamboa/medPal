from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

<<<<<<< HEAD:accounts/admin.py
# Register your models here.

=======
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'first_name', 'last_name_paterno', 'last_name_materno', 'phone', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name_paterno')
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información personal', {'fields': ('first_name', 'last_name_paterno', 'last_name_materno', 'phone')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name_paterno', 'last_name_materno', 'phone', 'password1', 'password2', 'is_staff', 'is_superuser'),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)
>>>>>>> f1f5572f3869c3041e015a1b72e566090f648a67:api/admin.py
