#!/usr/bin/env python3
"""
Script de prueba para verificar la funcionalidad de registro de usuarios
Ejecuta este script después de iniciar el servidor Django
"""

import requests
import json
import time

# Configuración
BASE_URL = "http://localhost:8000/accounts"
TEST_EMAIL = "rojasvallejo.josueramses@utacapulco.edu.mx"
TEST_PASSWORD = "rojas2004"
TEST_NAME = "Ramses"
TEST_APELLIDO_PATERNO = "Rojas"
TEST_APELLIDO_MATERNO = "Vallejo"
TEST_PHONE = "7441234567"

def test_signup_flow():
    print("🔄 Iniciando prueba de registro de usuario...\n")
    
    # Paso 1: Registrar nuevo usuario
    print("📝 Paso 1: Registrando nuevo usuario...")
    signup_data = {
        "name": TEST_NAME,
        "apellido_paterno": TEST_APELLIDO_PATERNO,
        "apellido_materno": TEST_APELLIDO_MATERNO,
        "phone": TEST_PHONE,
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
        "password2": TEST_PASSWORD
    }
    
    try:
        response = requests.post(f"{BASE_URL}/signup/", 
                               json=signup_data,
                               headers={'Content-Type': 'application/json'})
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 201:
            print("✅ Usuario registrado exitosamente")
            
            # Solicitar al usuario que ingrese el código de verificación
            print("\n📱 Revisa tu correo electrónico y ingresa el código de verificación de 6 dígitos:")
            verification_code = input("Código: ").strip()
            
            # Paso 2: Verificar código
            print("\n🔐 Paso 2: Verificando código...")
            verify_data = {
                "email": TEST_EMAIL,
                "code": verification_code
            }
            
            response = requests.post(f"{BASE_URL}/verify-code/", 
                                   json=verify_data,
                                   headers={'Content-Type': 'application/json'})
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                print("✅ Código verificado exitosamente")
                
                # Paso 3: Probar login con las credenciales
                print("\n🔑 Paso 3: Probando login con las credenciales...")
                login_data = {
                    "email": TEST_EMAIL,
                    "password": TEST_PASSWORD
                }
                
                response = requests.post(f"{BASE_URL}/signin/", 
                                       json=login_data,
                                       headers={'Content-Type': 'application/json'})
                
                print(f"Status Code: {response.status_code}")
                print(f"Response: {response.json()}")
                
                if response.status_code == 200:
                    print("✅ Login exitoso")
                    print("\n🎉 ¡Registro y verificación completados exitosamente!")
                else:
                    print("❌ Error en el login")
            else:
                print("❌ Error al verificar código")
        else:
            print("❌ Error al registrar usuario")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se puede conectar al servidor")
        print("Asegúrate de que el servidor Django esté ejecutándose en http://localhost:8000")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

def test_invalid_signup_scenarios():
    print("\n🧪 Probando escenarios inválidos de registro...\n")
    
    # Test 1: Email ya existente
    print("Test 1: Email ya existente")
    response = requests.post(f"{BASE_URL}/signup/", 
                           json={
                               "name": "Test",
                               "apellido_paterno": "User",
                               "apellido_materno": "Prueba",
                               "phone": "1234567890",
                               "email": TEST_EMAIL,
                               "password": "test123",
                               "password2": "test123"
                           },
                           headers={'Content-Type': 'application/json'})
    print(f"Status: {response.status_code}, Response: {response.json()}")
    
    # Test 2: Contraseñas no coinciden
    print("\nTest 2: Contraseñas no coinciden")
    response = requests.post(f"{BASE_URL}/signup/", 
                           json={
                               "name": "Test",
                               "apellido_paterno": "User",
                               "apellido_materno": "Prueba",
                               "phone": "1234567890",
                               "email": "otro@example.com",
                               "password": "password1",
                               "password2": "password2"
                           },
                           headers={'Content-Type': 'application/json'})
    print(f"Status: {response.status_code}, Response: {response.json()}")
    
    # Test 3: Email inválido
    print("\nTest 3: Email inválido")
    response = requests.post(f"{BASE_URL}/signup/", 
                           json={
                               "name": "Test",
                               "apellido_paterno": "User",
                               "apellido_materno": "Prueba",
                               "phone": "1234567890",
                               "email": "email_invalido",
                               "password": "test123",
                               "password2": "test123"
                           },
                           headers={'Content-Type': 'application/json'})
    print(f"Status: {response.status_code}, Response: {response.json()}")
    
    # Test 4: Teléfono inválido (no 10 dígitos)
    print("\nTest 4: Teléfono inválido")
    response = requests.post(f"{BASE_URL}/signup/", 
                           json={
                               "name": "Test",
                               "apellido_paterno": "User",
                               "apellido_materno": "Prueba",
                               "phone": "123",  # Muy corto
                               "email": "test@example.com",
                               "password": "test123",
                               "password2": "test123"
                           },
                           headers={'Content-Type': 'application/json'})
    print(f"Status: {response.status_code}, Response: {response.json()}")
    
    # Test 5: Nombre con caracteres inválidos
    print("\nTest 5: Nombre con caracteres inválidos")
    response = requests.post(f"{BASE_URL}/signup/", 
                           json={
                               "name": "Test123",  # Contiene números
                               "apellido_paterno": "User",
                               "apellido_materno": "Prueba",
                               "phone": "1234567890",
                               "email": "test2@example.com",
                               "password": "test123",
                               "password2": "test123"
                           },
                           headers={'Content-Type': 'application/json'})
    print(f"Status: {response.status_code}, Response: {response.json()}")

if __name__ == "__main__":
    print("🚀 Script de prueba para registro de usuarios - MedPal")
    print("=" * 60)
    
    choice = input("\n¿Qué quieres probar?\n1. Flujo completo de registro\n2. Escenarios inválidos\n3. Ambos\nElige (1/2/3): ")
    
    if choice == "1":
        test_signup_flow()
    elif choice == "2":
        test_invalid_signup_scenarios()
    elif choice == "3":
        test_signup_flow()
        test_invalid_signup_scenarios()
    else:
        print("Opción inválida")