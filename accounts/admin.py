from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    # Campos que se mostrarán en la lista del admin
    list_display = ('email', 'name', 'apellido_paterno', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff', 'is_superuser')
    
    # Campos que se usarán en el formulario de detalle
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información personal', {'fields': ('name', 'apellido_paterno', 'apellido_materno', 'phone')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Verificación', {'fields': ('verification_code',)}),
    )

    # Campos para crear un nuevo usuario desde el admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'apellido_paterno', 'apellido_materno', 'phone', 'password1', 'password2'),
        }),
    )

    search_fields = ('email', 'name', 'apellido_paterno')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)

admin.site.register(User, UserAdmin)