from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import timedelta
from unittest.mock import patch
from .models import User
from .serializers import SignupSerializer, ResetPasswordSerializer, SigninSerializer

User = get_user_model()


class UserModelTest(TestCase):
    """Tests para el modelo User"""
    
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'name': 'Juan',
            'apellido_paterno': 'Pérez',
            'apellido_materno': 'García'
        }
    
    def test_create_user(self):
        """Test creación básica de usuario"""
        user = User.objects.create_user(
            email=self.user_data['email'],
            password=self.user_data['password'],
            name=self.user_data['name'],
            apellido_paterno=self.user_data['apellido_paterno']
        )
        self.assertEqual(user.email, self.user_data['email'])
        self.assertTrue(user.check_password(self.user_data['password']))
        self.assertEqual(user.name, self.user_data['name'])
        self.assertTrue(user.is_active)
    
    def test_create_superuser(self):
        """Test creación de superusuario"""
        admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123',
            name='Admin',
            apellido_paterno='User'
        )
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.is_active)
    
    def test_generate_verification_code(self):
        """Test generación de código de verificación"""
        from .models import generate_verification_code
        user = User.objects.create_user(**self.user_data)
        code = generate_verification_code()
        user.set_verification_code(code)
        
        self.assertEqual(len(code), 6)
        self.assertTrue(code.isdigit())
        self.assertEqual(user.get_verification_code(), code)
        self.assertIsNotNone(user.verification_code_created_at)
    
    def test_verification_code_expiration(self):
        """Test expiración del código de verificación"""
        user = User.objects.create_user(**self.user_data)
        
        # Código recién creado - no expirado
        user.set_verification_code('123456')
        self.assertFalse(user.is_verification_code_expired())
        
        # Código expirado (6 minutos atrás)
        user.verification_code_created_at = timezone.now() - timedelta(minutes=6)
        user.save()
        self.assertTrue(user.is_verification_code_expired())
        
        # Sin código
        user.verification_code = ''
        user.verification_code_created_at = None
        user.save()
        self.assertTrue(user.is_verification_code_expired())
    
    def test_clear_verification_code(self):
        """Test limpieza del código de verificación"""
        user = User.objects.create_user(**self.user_data)
        user.set_verification_code('123456')
        
        user.clear_verification_code()
        
        self.assertEqual(user.verification_code, '')
        self.assertIsNone(user.verification_code_created_at)
    
    def test_email_unique(self):
        """Test que el email sea único"""
        User.objects.create_user(**self.user_data)
        
        with self.assertRaises(Exception):
            User.objects.create_user(**self.user_data)


class SignupSerializerTest(TestCase):
    """Tests para SignupSerializer"""
    
    def setUp(self):
        self.valid_data = {
            'name': 'Juan',
            'apellido_paterno': 'Pérez',
            'apellido_materno': 'García',
            'phone': '1234567890',
            'email': 'juan@test.com',
            'password': 'testpass123',
            'password2': 'testpass123'
        }
    
    def test_valid_signup_data(self):
        """Test con datos válidos"""
        serializer = SignupSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        
        user = serializer.save()
        self.assertEqual(user.email, self.valid_data['email'])
        self.assertEqual(user.name, self.valid_data['name'])
        self.assertTrue(user.is_active)
        # Verificar que el código de verificación fue generado
        decrypted_code = user.get_verification_code()
        self.assertIsNotNone(decrypted_code)
        self.assertEqual(len(decrypted_code), 6)
    
    def test_password_mismatch(self):
        """Test con contraseñas que no coinciden"""
        data = self.valid_data.copy()
        data['password2'] = 'differentpass'
        
        serializer = SignupSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
    
    def test_duplicate_email(self):
        """Test con email duplicado"""
        User.objects.create_user(
            email=self.valid_data['email'],
            password='somepass',
            name='Existing',
            apellido_paterno='User',
            phone='9876543210'
        )
        
        serializer = SignupSerializer(data=self.valid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)
    
    def test_missing_required_fields(self):
        """Test con campos requeridos faltantes"""
        data = {'email': 'test@test.com'}
        
        serializer = SignupSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)
        self.assertIn('apellido_paterno', serializer.errors)
        self.assertIn('password', serializer.errors)


class ResetPasswordSerializerTest(TestCase):
    """Tests para ResetPasswordSerializer"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='oldpass123',
            name='Test',
            apellido_paterno='User',
            phone='1234567890'
        )
        self.user.set_verification_code('123456')
        
        self.valid_data = {
            'email': 'test@example.com',
            'code': '123456',
            'new_password': 'newpass123',
            'new_password2': 'newpass123'
        }
    
    def test_valid_password_reset(self):
        """Test reset de contraseña válido"""
        serializer = ResetPasswordSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        
        serializer.save()
        
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpass123'))
        self.assertEqual(self.user.verification_code, '')
        self.assertIsNone(self.user.verification_code_created_at)
    
    def test_invalid_email(self):
        """Test con email inexistente"""
        data = self.valid_data.copy()
        data['email'] = 'nonexistent@example.com'
        
        serializer = ResetPasswordSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)
    
    def test_invalid_code(self):
        """Test con código incorrecto"""
        data = self.valid_data.copy()
        data['code'] = '999999'
        
        serializer = ResetPasswordSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('code', serializer.errors)
    
    def test_expired_code(self):
        """Test con código expirado"""
        self.user.verification_code_created_at = timezone.now() - timedelta(minutes=6)
        self.user.save()
        
        serializer = ResetPasswordSerializer(data=self.valid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('code', serializer.errors)
    
    def test_password_mismatch(self):
        """Test con contraseñas que no coinciden"""
        data = self.valid_data.copy()
        data['new_password2'] = 'differentpass'
        
        serializer = ResetPasswordSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
    
    def test_no_verification_code(self):
        """Test sin código de verificación"""
        self.user.clear_verification_code()
        
        serializer = ResetPasswordSerializer(data=self.valid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('code', serializer.errors)


class SigninSerializerTest(TestCase):
    """Tests para SigninSerializer"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            name='Test',
            apellido_paterno='User',
            phone='1234567890'
        )
        self.user.is_active = True
        self.user.save()
        
        self.valid_data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
    
    def test_valid_login(self):
        """Test login válido"""
        serializer = SigninSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
    
    def test_invalid_credentials(self):
        """Test con credenciales incorrectas"""
        data = self.valid_data.copy()
        data['password'] = 'wrongpass'
        
        serializer = SigninSerializer(data=data)
        self.assertFalse(serializer.is_valid())
    
    def test_unverified_user(self):
        """Test con usuario no verificado"""
        self.user.is_active = False
        self.user.save()
        
        serializer = SigninSerializer(data=self.valid_data)
        self.assertFalse(serializer.is_valid())


class AccountsAPITest(APITestCase):
    """Tests para las APIs de accounts"""
    
    def setUp(self):
        self.signup_url = '/accounts/signup/'
        self.login_url = '/accounts/signin/'
        self.verify_url = '/accounts/verify/'
        self.request_reset_url = '/accounts/request-password-reset/'
        self.reset_password_url = '/accounts/reset-password/'
        
        self.user_data = {
            'name': 'Juan',
            'apellido_paterno': 'Pérez',
            'apellido_materno': 'García',
            'phone': '1234567890',
            'email': 'juan@test.com',
            'password': 'testpass123',
            'password2': 'testpass123'
        }
    
    def test_signup_success(self):
        """Test registro exitoso"""
        response = self.client.post(self.signup_url, self.user_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)
        
        user = User.objects.get(email=self.user_data['email'])
        self.assertTrue(user.is_active)
        # Verificar que el código de verificación fue generado
        decrypted_code = user.get_verification_code()
        self.assertIsNotNone(decrypted_code)
        self.assertEqual(len(decrypted_code), 6)
    
    def test_signup_duplicate_email(self):
        """Test registro con email duplicado"""
        User.objects.create_user(
            email=self.user_data['email'],
            password='somepass',
            name='Existing',
            apellido_paterno='User',
            phone='9876543210'
        )
        
        response = self.client.post(self.signup_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    @patch('accounts.views.send_mail')
    def test_request_password_reset_success(self, mock_send_mail):
        """Test solicitud de reset de contraseña exitosa"""
        user = User.objects.create_user(
            email='test@example.com',
            password='oldpass123',
            name='Test',
            apellido_paterno='User',
            phone='1234567890'
        )
        
        data = {'email': 'test@example.com'}
        response = self.client.post(self.request_reset_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        
        user.refresh_from_db()
        decrypted_code = user.get_verification_code()
        self.assertIsNotNone(decrypted_code)
        self.assertIsNotNone(user.verification_code_created_at)
        
        # Verificar que se envió el email
        mock_send_mail.assert_called_once()
    
    def test_request_password_reset_invalid_email(self):
        """Test solicitud con email inexistente"""
        data = {'email': 'nonexistent@example.com'}
        response = self.client.post(self.request_reset_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_reset_password_success(self):
        """Test reset de contraseña exitoso"""
        user = User.objects.create_user(
            email='test@example.com',
            password='oldpass123',
            name='Test',
            apellido_paterno='User',
            phone='1234567890'
        )
        user.set_verification_code('123456')
        
        data = {
            'email': 'test@example.com',
            'code': '123456',
            'new_password': 'newpass123',
            'new_password2': 'newpass123'
        }
        response = self.client.post(self.reset_password_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        user.refresh_from_db()
        self.assertTrue(user.check_password('newpass123'))
        self.assertEqual(user.verification_code, '')
    
    def test_verify_code_success(self):
        """Test verificación de código exitosa"""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            name='Test',
            apellido_paterno='User',
            phone='1234567890'
        )
        user.set_verification_code('123456')
        
        data = {
            'email': 'test@example.com',
            'code': '123456'
        }
        response = self.client.post(self.verify_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        user.refresh_from_db()
        self.assertTrue(user.is_active)
        self.assertEqual(user.verification_code, '')
    
    def test_verify_code_expired(self):
        """Test verificación con código expirado"""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            name='Test',
            apellido_paterno='User',
            phone='1234567890'
        )
        user.verification_code = '123456'
        user.verification_code_created_at = timezone.now() - timedelta(minutes=6)
        user.save()
        
        data = {
            'email': 'test@example.com',
            'code': '123456'
        }
        response = self.client.post(self.verify_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
    
    def test_login_success(self):
        """Test login exitoso"""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            name='Test',
            apellido_paterno='User',
            phone='1234567890'
        )
        user.is_active = True
        user.save()
        
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_login_unverified_user(self):
        """Test login con usuario no verificado"""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            name='Test',
            apellido_paterno='User',
            phone='1234567890'
        )
        # Usuario no verificado (is_active=False por defecto)
        
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_logout_success(self):
        """Test logout exitoso"""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            name='Test',
            apellido_paterno='User',
            phone='1234567890'
        )
        user.is_active = True
        user.save()
        
        # Primero hacer login para obtener token
        login_data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        
        # Hacer logout
        logout_url = '/accounts/logout/'
        response = self.client.post(logout_url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Sesión cerrada exitosamente.')


class PasswordResetFlowTest(APITestCase):
    """Test del flujo completo de reset de contraseña"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='oldpass123',
            name='Test',
            apellido_paterno='User',
            phone='1234567890'
        )
        self.user.is_active = True
        self.user.save()
    
    @patch('accounts.views.send_mail')
    def test_complete_password_reset_flow(self, mock_send_mail):
        """Test del flujo completo: solicitar código -> resetear contraseña -> login"""
        
        # 1. Solicitar código de reset
        request_data = {'email': 'test@example.com'}
        response = self.client.post(
            '/accounts/request-password-reset/',
            request_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que se generó el código
        self.user.refresh_from_db()
        self.assertIsNotNone(self.user.verification_code)
        verification_code = self.user.verification_code
        
        # 2. Resetear contraseña con el código
        reset_data = {
            'email': 'test@example.com',
            'code': verification_code,
            'new_password': 'newpass123',
            'new_password2': 'newpass123'
        }
        response = self.client.post(
            '/accounts/reset-password/',
            reset_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que se cambió la contraseña y se limpió el código
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpass123'))
        self.assertEqual(self.user.verification_code, '')
        
        # 3. Login con la nueva contraseña
        login_data = {
            'email': 'test@example.com',
            'password': 'newpass123'
        }
        response = self.client.post(
            '/accounts/signin/',
            login_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        
        # Verificar que el email se envió
        mock_send_mail.assert_called_once()