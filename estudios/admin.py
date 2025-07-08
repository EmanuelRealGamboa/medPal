from django.contrib import admin
from .models import EstudioGabinete, EstudioLaboratorio, EstudioFuncional

# Register your models here.


admin.site.register(EstudioGabinete)
admin.site.register(EstudioLaboratorio)
admin.site.register(EstudioFuncional)