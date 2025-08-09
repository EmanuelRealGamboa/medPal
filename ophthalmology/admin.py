from django.contrib import admin
from django.utils.html import format_html
from .models import OphthalmologyDiagnosis

@admin.register(OphthalmologyDiagnosis)
class OphthalmologyDiagnosisAdmin(admin.ModelAdmin):
    list_display = ('patient_name', 'exam_date', 'attention_type', 'get_document_preview')
    search_fields = ('patient_name', 'diagnosis')
    list_filter = ('exam_date', 'attention_type')
    readonly_fields = ('created_at', 'get_document_preview')

    fieldsets = (
        (None, {
            'fields': (
                'patient_name', 'exam_date', 'attention_type',
                'diagnosis', 'notes', 'document',
                'get_document_preview', 'created_at',
            ),
        }),
    )

    def get_document_preview(self, obj):
        if obj.document:
            name = obj.document.name.lower()
            if name.endswith(('.jpg', '.jpeg', '.png')):
                return format_html('<img src="{}" width="300" />', obj.document.url)
            elif name.endswith('.pdf'):
                return format_html('<a href="{}" target="_blank">View PDF</a>', obj.document.url)
            else:
                return format_html('<a href="{}" target="_blank">Download File</a>', obj.document.url)
        return "No file uploaded"

    get_document_preview.short_description = "Preview"
