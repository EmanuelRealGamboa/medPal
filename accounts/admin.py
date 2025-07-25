from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import PersonalData  # Asegúrate de que está en el mismo app

User = get_user_model()

# Inline para editar datos personales desde admin de usuario
class PersonalDataInline(admin.StackedInline):
    model = PersonalData
    can_delete = False
    verbose_name_plural = "Datos personales extendidos"
    fk_name = 'user'  # Este debe coincidir con el OneToOneField en tu modelo

# Registrar el modelo User con PersonalData inline
@admin.register(User)
class UserAdminConfig(UserAdmin):
    inlines = (PersonalDataInline,)

    list_display  = ('email', 'name', 'apellido_paterno', 'apellido_materno', 'phone', 'is_staff')
    search_fields = ('email', 'name', 'apellido_paterno')
    ordering      = ('email',)
    fieldsets = (
        (None,               {'fields': ('email','password')}),
        ('Datos personales', {'fields': ('name','apellido_paterno','apellido_materno','phone')}),
        ('Permisos',         {'fields': ('is_active','is_staff','is_superuser','groups','user_permissions')}),
        ('Fechas',           {'fields': ('last_login','created_at')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email','name','apellido_paterno','apellido_materno','phone','password1','password2','is_staff','is_superuser'),
        }),
    )

    def get_inline_instances(self, request, obj=None):
        """
        Esto evita que falle cuando estás creando un nuevo usuario
        (ya que aún no hay un PersonalData asociado).
        """
        if not obj:
            return []
        return super().get_inline_instances(request, obj)