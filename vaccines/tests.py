from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import date, timedelta
from .models import VaccineType, VaccineRecord, VaccineAlert

User = get_user_model()

class VaccineModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            name='Test',
            apellido_paterno='User',
            phone='1234567890'
        )
        
        self.vaccine_type = VaccineType.objects.create(
            name='COVID-19',
            description='Vacuna contra COVID-19',
            manufacturer='Pfizer',
            doses_required=2,
            interval_days=21
        )
    
    def test_vaccine_type_creation(self):
        self.assertEqual(self.vaccine_type.name, 'COVID-19')
        self.assertEqual(self.vaccine_type.doses_required, 2)
        self.assertTrue(self.vaccine_type.is_active)
    
    def test_vaccine_record_creation(self):
        record = VaccineRecord.objects.create(
            user=self.user,
            vaccine_type=self.vaccine_type,
            dose_number=1,
            scheduled_date=date.today() + timedelta(days=7)
        )
        
        self.assertEqual(record.status, 'scheduled')
        self.assertFalse(record.is_overdue)
    
    def test_vaccine_record_overdue(self):
        record = VaccineRecord.objects.create(
            user=self.user,
            vaccine_type=self.vaccine_type,
            dose_number=1,
            scheduled_date=date.today() - timedelta(days=7)
        )
        
        self.assertTrue(record.is_overdue)
        self.assertEqual(record.days_until_due, -7)
    
    def test_next_dose_calculation(self):
        record = VaccineRecord.objects.create(
            user=self.user,
            vaccine_type=self.vaccine_type,
            dose_number=1,
            scheduled_date=date.today(),
            applied_date=date.today(),
            status='applied'
        )
        
        next_dose_date = record.next_dose_date
        expected_date = date.today() + timedelta(days=21)
        self.assertEqual(next_dose_date, expected_date)

class VaccineAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            name='Test',
            apellido_paterno='User',
            phone='1234567890'
        )
        
        self.vaccine_type = VaccineType.objects.create(
            name='COVID-19',
            description='Vacuna contra COVID-19',
            manufacturer='Pfizer',
            doses_required=2,
            interval_days=21
        )
        
        self.client.force_authenticate(user=self.user)
    
    def test_create_vaccine_record(self):
        data = {
            'vaccine_type': self.vaccine_type.id,
            'dose_number': 1,
            'scheduled_date': date.today() + timedelta(days=7)
        }
        
        response = self.client.post('/vaccines/records/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(VaccineRecord.objects.count(), 1)
    
    def test_get_vaccination_card(self):
        VaccineRecord.objects.create(
            user=self.user,
            vaccine_type=self.vaccine_type,
            dose_number=1,
            scheduled_date=date.today() + timedelta(days=7)
        )
        
        response = self.client.get('/vaccines/card/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_vaccines', response.data)
        self.assertEqual(response.data['total_vaccines'], 1)
    
    def test_mark_vaccine_applied(self):
        record = VaccineRecord.objects.create(
            user=self.user,
            vaccine_type=self.vaccine_type,
            dose_number=1,
            scheduled_date=date.today()
        )
        
        data = {
            'applied_date': date.today(),
            'healthcare_provider': 'Hospital Test',
            'doctor_name': 'Dr. Test'
        }
        
        response = self.client.post(f'/vaccines/records/{record.id}/mark_applied/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        record.refresh_from_db()
        self.assertEqual(record.status, 'applied')
        self.assertEqual(record.healthcare_provider, 'Hospital Test')
    
    def test_upcoming_vaccines(self):
        # Vacuna próxima
        VaccineRecord.objects.create(
            user=self.user,
            vaccine_type=self.vaccine_type,
            dose_number=1,
            scheduled_date=date.today() + timedelta(days=15)
        )
        
        # Vacuna lejana
        VaccineRecord.objects.create(
            user=self.user,
            vaccine_type=self.vaccine_type,
            dose_number=2,
            scheduled_date=date.today() + timedelta(days=60)
        )
        
        response = self.client.get('/vaccines/records/upcoming/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Solo la próxima
    
    def test_vaccine_stats(self):
        VaccineRecord.objects.create(
            user=self.user,
            vaccine_type=self.vaccine_type,
            dose_number=1,
            scheduled_date=date.today(),
            applied_date=date.today(),
            status='applied'
        )
        
        VaccineRecord.objects.create(
            user=self.user,
            vaccine_type=self.vaccine_type,
            dose_number=2,
            scheduled_date=date.today() + timedelta(days=21)
        )
        
        response = self.client.get('/vaccines/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_records'], 2)
        self.assertEqual(response.data['applied_count'], 1)
        self.assertEqual(response.data['pending_count'], 1)
        self.assertEqual(response.data['completion_rate'], 50.0)
