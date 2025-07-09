from django.contrib import admin
from .models import OphthalmologyDiagnosis
from django.utils.html import format_html

@admin.register(OphthalmologyDiagnosis)
class OphthalmologyDiagnosisAdmin(admin.ModelAdmin):
    list_display = ('patient', 'exam_date', 'attention_type', 'view_document')
    search_fields = ('patient__email', 'diagnosis')
    list_filter = ('exam_date', 'attention_type')
    readonly_fields = ('created_at', 'document_preview')

    fieldsets = (
        (None, {
            'fields': (
                'patient', 'exam_date', 'attention_type',
                'diagnosis', 'notes', 'document',
                'document_preview', 'created_at',
            ),
        }),
    )

    def view_document(self, obj):
        if obj.document:
            if obj.document.name.endswith(('.jpg', '.jpeg', '.png')):
                return format_html('<img src="{}" width="100" height="100" />', obj.document.url)
            return format_html('<a href="{}">View PDF</a>', obj.document.url)
        return "No file"

    view_document.short_description = "Document"

    def document_preview(self, obj):
        if obj.document:
            if obj.document.name.endswith(('.jpg', '.jpeg', '.png')):
                return format_html('<img src="{}" width="300" />', obj.document.url)
            return format_html('<a href="{}">Download PDF</a>', obj.document.url)
        return "No file uploaded"

    document_preview.short_description = "Preview"
