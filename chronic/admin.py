from django.contrib import admin
from .models import ChronicCondition, Symptom, Complication

class SymptomInline(admin.TabularInline):
    model = Symptom
    extra = 0

class ComplicationInline(admin.TabularInline):
    model = Complication
    extra = 0

@admin.register(ChronicCondition)
class ChronicAdmin(admin.ModelAdmin):
    list_display = ('patient_user','disease_name','current_status','classification_system','classification_level','is_active')
    list_filter = ('current_status','classification_system','is_active')
    search_fields = ('disease_name','diagnosing_institution','diagnosing_physician')
    inlines = [SymptomInline, ComplicationInline]
