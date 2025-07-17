from django.core.management.base import BaseCommand
from vaccines.services import CDCVaccineService

class Command(BaseCommand):
    help = 'Sincronizar tipos de vacunas con datos del CDC'

    def handle(self, *args, **options):
        self.stdout.write('Iniciando sincronización con CDC...')
        
        service = CDCVaccineService()
        service.sync_vaccine_types()
        
        self.stdout.write(
            self.style.SUCCESS('Sincronización completada exitosamente')
        )