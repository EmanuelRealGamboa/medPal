import requests
import logging
from django.conf import settings
from django.core.cache import cache
from typing import Dict, List, Optional
import json

logger = logging.getLogger(__name__)

class CDCVaccineService:
    """
    Servicio para integración con datos de vacunas del CDC
    Simula una API REST usando datos oficiales del CDC
    """
    
    def __init__(self):
        self.base_url = getattr(settings, 'CDC_API_BASE_URL', 'https://www2a.cdc.gov')
        self.api_key = getattr(settings, 'CDC_API_KEY', None)
        self.timeout = 30
        
        # Datos oficiales del CDC CVX Code Set
        self.cdc_vaccine_data = {
            "vaccines": [
                {
                    "cvx_code": "03",
                    "short_description": "MMR",
                    "full_vaccine_name": "measles, mumps and rubella virus vaccine live",
                    "status": "Active",
                    "vaccine_group": "MMR",
                    "manufacturer_codes": ["MSD", "GSK"],
                    "route": "Subcutaneous",
                    "age_range": "12 months - adult"
                },
                {
                    "cvx_code": "08",
                    "short_description": "Hep B, adolescent or pediatric",
                    "full_vaccine_name": "hepatitis B vaccine, pediatric or pediatric/adolescent dosage",
                    "status": "Active",
                    "vaccine_group": "HepB",
                    "manufacturer_codes": ["MSD", "GSK"],
                    "route": "Intramuscular",
                    "age_range": "Birth - 19 years"
                },
                {
                    "cvx_code": "10",
                    "short_description": "IPV",
                    "full_vaccine_name": "poliovirus vaccine, inactivated",
                    "status": "Active",
                    "vaccine_group": "POLIO",
                    "manufacturer_codes": ["SAN"],
                    "route": "Intramuscular",
                    "age_range": "6 weeks - adult"
                },
                {
                    "cvx_code": "20",
                    "short_description": "DTaP",
                    "full_vaccine_name": "diphtheria, tetanus toxoids and acellular pertussis vaccine",
                    "status": "Active",
                    "vaccine_group": "DTAP",
                    "manufacturer_codes": ["SAN", "GSK"],
                    "route": "Intramuscular",
                    "age_range": "6 weeks - 6 years"
                },
                {
                    "cvx_code": "17",
                    "short_description": "Hib (PRP-D)",
                    "full_vaccine_name": "Haemophilus influenzae type b vaccine, conjugate (PRP-D)",
                    "status": "Active",
                    "vaccine_group": "HIB",
                    "manufacturer_codes": ["SAN", "GSK"],
                    "route": "Intramuscular",
                    "age_range": "2 months - 5 years"
                },
                {
                    "cvx_code": "133",
                    "short_description": "Pneumococcal conjugate PCV 13",
                    "full_vaccine_name": "pneumococcal conjugate vaccine, 13 valent",
                    "status": "Active",
                    "vaccine_group": "PneumoPCV",
                    "manufacturer_codes": ["PFR"],
                    "route": "Intramuscular",
                    "age_range": "6 weeks - adult"
                },
                {
                    "cvx_code": "122",
                    "short_description": "Rotavirus, unspecified formulation",
                    "full_vaccine_name": "rotavirus vaccine, unspecified formulation",
                    "status": "Active",
                    "vaccine_group": "ROTAVIRUS",
                    "manufacturer_codes": ["MSD", "GSK"],
                    "route": "Oral",
                    "age_range": "6 weeks - 8 months"
                },
                {
                    "cvx_code": "88",
                    "short_description": "Influenza, unspecified formulation",
                    "full_vaccine_name": "influenza virus vaccine, unspecified formulation",
                    "status": "Active",
                    "vaccine_group": "FLU",
                    "manufacturer_codes": ["SAN", "GSK", "SEQ"],
                    "route": "Intramuscular",
                    "age_range": "6 months - adult"
                },
                {
                    "cvx_code": "137",
                    "short_description": "HPV, unspecified formulation",
                    "full_vaccine_name": "human papillomavirus vaccine, unspecified formulation",
                    "status": "Active",
                    "vaccine_group": "HPV",
                    "manufacturer_codes": ["MSD", "GSK"],
                    "route": "Intramuscular",
                    "age_range": "9 - 45 years"
                },
                {
                    "cvx_code": "115",
                    "short_description": "Tdap",
                    "full_vaccine_name": "tetanus toxoid, reduced diphtheria toxoid, and acellular pertussis vaccine, adsorbed",
                    "status": "Active",
                    "vaccine_group": "TDAP",
                    "manufacturer_codes": ["SAN", "GSK"],
                    "route": "Intramuscular",
                    "age_range": "10 years - adult"
                },
                {
                    "cvx_code": "21",
                    "short_description": "Varicella",
                    "full_vaccine_name": "varicella virus vaccine live",
                    "status": "Active",
                    "vaccine_group": "VAR",
                    "manufacturer_codes": ["MSD"],
                    "route": "Subcutaneous",
                    "age_range": "12 months - adult"
                },
                {
                    "cvx_code": "85",
                    "short_description": "Hep A, unspecified formulation",
                    "full_vaccine_name": "hepatitis A vaccine, unspecified formulation",
                    "status": "Active",
                    "vaccine_group": "HepA",
                    "manufacturer_codes": ["MSD", "GSK"],
                    "route": "Intramuscular",
                    "age_range": "12 months - adult"
                }
            ],
            "manufacturers": [
                {"mvx_code": "MSD", "name": "Merck and Co., Inc."},
                {"mvx_code": "GSK", "name": "GlaxoSmithKline"},
                {"mvx_code": "SAN", "name": "Sanofi Pasteur"},
                {"mvx_code": "PFR", "name": "Pfizer, Inc"},
                {"mvx_code": "SEQ", "name": "Seqirus"}
            ]
        }
        
    def _make_request(self, endpoint: str, params: Dict = None) -> Optional[Dict]:
        """
        Simular petición HTTP al CDC API usando datos locales
        """
        try:
            logger.info(f"Simulando petición CDC: {endpoint}")
            
            if endpoint == 'vaccine-codes':
                status_filter = params.get('status', 'Active') if params else 'Active'
                vaccines = self.cdc_vaccine_data['vaccines']
                if status_filter == 'Active':
                    vaccines = [v for v in vaccines if v['status'] == 'Active']
                return {"vaccines": vaccines}
            
            elif endpoint.startswith('vaccine-codes/'):
                cvx_code = endpoint.split('/')[-1]
                for vaccine in self.cdc_vaccine_data['vaccines']:
                    if vaccine['cvx_code'] == cvx_code:
                        return vaccine
                return None
            
            elif endpoint == 'manufacturer-codes':
                return {"manufacturers": self.cdc_vaccine_data['manufacturers']}
            
            return None
                
        except Exception as e:
            logger.error(f"Error en simulación CDC API: {str(e)}")
            return None
    
    def get_vaccine_codes(self, status: str = 'Active') -> List[Dict]:
        """
        Obtener códigos CVX de vacunas del CDC
        """
        cache_key = f'cdc_vaccine_codes_{status.lower()}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            logger.info("Datos CDC obtenidos desde cache")
            return cached_data
        
        params = {'status': status}
        data = self._make_request('vaccine-codes', params)
        
        if data:
            vaccines = data.get('vaccines', [])
            # Cache por 24 horas
            cache.set(cache_key, vaccines, 86400)
            logger.info(f"Obtenidas {len(vaccines)} vacunas del CDC")
            return vaccines
        
        return []
    
    def get_vaccine_by_cvx(self, cvx_code: str) -> Optional[Dict]:
        """
        Obtener información específica de una vacuna por código CVX
        """
        cache_key = f'cdc_vaccine_{cvx_code}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        data = self._make_request(f'vaccine-codes/{cvx_code}')
        
        if data:
            cache.set(cache_key, data, 86400)
            return data
        
        return None
    
    def get_manufacturer_codes(self) -> List[Dict]:
        """
        Obtener códigos MVX de fabricantes
        """
        cache_key = 'cdc_manufacturer_codes'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        data = self._make_request('manufacturer-codes')
        
        if data:
            manufacturers = data.get('manufacturers', [])
            cache.set(cache_key, manufacturers, 86400)
            return manufacturers
        
        return []
    
    def sync_vaccine_types(self):
        """
        Sincronizar tipos de vacunas con datos del CDC
        """
        from .models import VaccineType
        
        logger.info("Iniciando sincronización con CDC...")
        
        cdc_vaccines = self.get_vaccine_codes()
        created_count = 0
        updated_count = 0
        
        for vaccine_data in cdc_vaccines:
            cvx_code = vaccine_data.get('cvx_code')
            name = vaccine_data.get('short_description')
            full_name = vaccine_data.get('full_vaccine_name')
            status = vaccine_data.get('status', 'Active')
            
            if cvx_code and name:
                vaccine_type, created = VaccineType.objects.get_or_create(
                    cvx_code=cvx_code,
                    defaults={
                        'name': name,
                        'description': full_name or name,
                        'is_active': status == 'Active',
                        'cdc_data': vaccine_data,
                        'recommended_ages': self._get_recommended_ages(vaccine_data.get('vaccine_group', ''))
                    }
                )
                
                if created:
                    created_count += 1
                    logger.info(f"Creada vacuna: {name} (CVX: {cvx_code})")
                else:
                    # Actualizar datos existentes
                    vaccine_type.name = name
                    vaccine_type.description = full_name or name
                    vaccine_type.is_active = status == 'Active'
                    vaccine_type.cdc_data = vaccine_data
                    vaccine_type.save()
                    updated_count += 1
                    logger.info(f"Actualizada vacuna: {name} (CVX: {cvx_code})")
        
        logger.info(f"Sincronización CDC completada: {created_count} creadas, {updated_count} actualizadas")
        print(f"✅ Sincronización exitosa: {created_count} vacunas creadas, {updated_count} actualizadas")
        return created_count, updated_count
    
    def _get_recommended_ages(self, vaccine_group: str) -> str:
        """
        Obtener edades recomendadas por grupo de vacuna según CDC
        """
        age_schedules = {
            'MMR': '12-15 meses, 4-6 años',
            'HepB': 'Nacimiento, 1-2 meses, 6-18 meses',
            'POLIO': '2 meses, 4 meses, 6-18 meses, 4-6 años',
            'DTAP': '2 meses, 4 meses, 6 meses, 15-18 meses, 4-6 años',
            'HIB': '2 meses, 4 meses, 6 meses, 12-15 meses',
            'PneumoPCV': '2 meses, 4 meses, 6 meses, 12-15 meses',
            'ROTAVIRUS': '2 meses, 4 meses, 6 meses',
            'FLU': 'Anual desde 6 meses',
            'HPV': '11-12 años (2 dosis)',
            'TDAP': '11-12 años, embarazo',
            'VAR': '12-15 meses, 4-6 años',
            'HepA': '12-23 meses, 2-18 años'
        }
        return age_schedules.get(vaccine_group, 'Consultar con médico')