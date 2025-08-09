from django.contrib import admin
from .models import VaccineType, VaccineRecord, VaccineAlert

@admin.register(VaccineType)
class VaccineTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'manufacturer', 'doses_required', 'interval_days', 'is_active']
    list_filter = ['is_active', 'manufacturer', 'doses_required']
    search_fields = ['name', 'description', 'manufacturer']
    ordering = ['name']

@admin.register(VaccineRecord)
class VaccineRecordAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'vaccine_type', 'dose_number', 'status', 
        'scheduled_date', 'applied_date', 'healthcare_provider'
    ]
    list_filter = [
        'status', 'vaccine_type', 'reaction', 'scheduled_date', 'applied_date'
    ]
    search_fields = [
        'user__email', 'user__name', 'vaccine_type__name', 
        'healthcare_provider', 'doctor_name'
    ]
    date_hierarchy = 'scheduled_date'
    ordering = ['-scheduled_date']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('user', 'vaccine_type', 'dose_number', 'status')
        }),
        ('Fechas', {
            'fields': ('scheduled_date', 'applied_date')
        }),
        ('Información Médica', {
            'fields': ('healthcare_provider', 'doctor_name', 'batch_number')
        }),
        ('Reacciones y Observaciones', {
            'fields': ('reaction', 'reaction_notes', 'notes')
        }),
        ('Metadatos', {
            'fields': ('created_by',),
            'classes': ('collapse',)
        })
    )

@admin.register(VaccineAlert)
class VaccineAlertAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'alert_type', 'priority', 'alert_date', 
        'is_read', 'is_sent', 'vaccine_record'
    ]
    list_filter = [
        'alert_type', 'priority', 'is_read', 'is_sent', 'alert_date'
    ]
    search_fields = ['user__email', 'message', 'vaccine_record__vaccine_type__name']
    date_hierarchy = 'alert_date'
    ordering = ['-alert_date']
    
    actions = ['mark_as_read', 'mark_as_sent']
    
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Marcar como leídas"
    
    def mark_as_sent(self, request, queryset):
        from django.utils import timezone
        queryset.update(is_sent=True, sent_at=timezone.now())
    mark_as_sent.short_description = "Marcar como enviadas"
