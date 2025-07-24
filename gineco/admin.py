from django.contrib import admin
from .models import MenstrualRecord, Pregnancy, PregnancyCheck, ClinicalNote

class BaseGinecoAdmin(admin.ModelAdmin):
    """Muestra solo registros de usuarias con género 'F'."""
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs

@admin.register(MenstrualRecord)
class MenstrualRecordAdmin(BaseGinecoAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # MenstrualRecord tiene campo user directo
        return qs.filter(user__personal_data__genero='F')
    list_display  = ('user', 'fecha_ultima_menstruacion', 'duracion_promedio_ciclo', 'es_regular')
    list_filter   = ('es_regular',)
    search_fields = ('user__email',)

@admin.register(Pregnancy)
class PregnancyAdmin(BaseGinecoAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Pregnancy tiene campo user directo
        return qs.filter(user__personal_data__genero='F')
    list_display  = ('user', 'fecha_ultima_menstruacion', 'fecha_probable_parto', 'nivel_riesgo')
    list_filter   = ('nivel_riesgo',)
    search_fields = ('user__email',)

@admin.register(PregnancyCheck)
class PregnancyCheckAdmin(BaseGinecoAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # PregnancyCheck no tiene user directo, se filtra a través de pregnancy
        return qs.filter(pregnancy__user__personal_data__genero='F')
    list_display  = ('pregnancy', 'mes_gestacional', 'peso', 'movimientos_fetales')
    search_fields = ('pregnancy__user__email',)

@admin.register(ClinicalNote)
class ClinicalNoteAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # ClinicalNote se filtra a través de pregnancy
        return qs.filter(pregnancy__user__personal_data__genero='F')
    list_display = ('id', 'pregnancy', 'fecha_cita', 'created_at')
    search_fields = ('pregnancy__user__email',)
    list_filter = ('pregnancy__user',)
