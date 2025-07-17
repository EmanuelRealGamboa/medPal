from django.contrib import admin
from .models import MedicalPrescription
from django.utils.html import format_html

@admin.register(MedicalPrescription)
class MedicalPrescriptionAdmin(admin.ModelAdmin):
    list_display = (
        'patient_name', 'issue_date', 'institution',
        'prescribing_doctor', 'specialty',
        'medications', 
        'view_file'
    )
    search_fields = ('patient_name', 'prescribing_doctor', 'institution')
    list_filter = ('issue_date', 'specialty')
    readonly_fields = ('created_at', 'file_preview')

    fieldsets = (
        (None, {
            'fields': (
                'patient_name', 'issue_date', 'institution',
                'prescribing_doctor', 'specialty', 'description', 'medications',
                'file', 'file_preview', 'created_at',
            ),
        }),
    )

    def view_file(self, obj):
        if obj.file and obj.file.url.lower().endswith(('.jpg', '.jpeg', '.png')):
            return format_html('<img src="{}" width="100" height="100" />', obj.file.url)
        elif obj.file and obj.file.url.lower().endswith('.pdf'):
            return format_html('<a href="{}" target="_blank">View PDF</a>', obj.file.url)
        return "No file"

    view_file.short_description = "Preview"

    def file_preview(self, obj):
        if obj.file and obj.file.url.lower().endswith(('.jpg', '.jpeg', '.png')):
            return format_html('<img src="{}" width="300" />', obj.file.url)
        elif obj.file and obj.file.url.lower().endswith('.pdf'):
            return format_html('<a href="{}" target="_blank">Open PDF</a>', obj.file.url)
        return "No file uploaded"

    file_preview.short_description = "File Preview (form)"
