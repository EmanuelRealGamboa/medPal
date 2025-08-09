#!/usr/bin/env python3
"""
Script de prueba para verificar la funcionalidad de recuperación de contraseña
Ejecuta este script después de iniciar el servidor Django
"""

import requests
import json
import time

# Configuración
BASE_URL = "http://localhost:8000/accounts"
TEST_EMAIL = "josueramsesrojasvallejo@gmail.com"
TEST_PASSWORD = "rojas2004"

def test_password_reset_flow():
    print("🔄 Iniciando prueba de recuperación de contraseña...\n")
    
    # Paso 1: Solicitar código de recuperación
    print("📧 Paso 1: Solicitando código de recuperación...")
    reset_request_data = {
        "email": TEST_EMAIL
    }
    
    try:
        response = requests.post(f"{BASE_URL}/request-password-reset/", 
                               json=reset_request_data,
                               headers={'Content-Type': 'application/json'})
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Código enviado exitosamente")
            
            # Solicitar al usuario que ingrese el código
            print("\n📱 Revisa tu correo electrónico y ingresa el código de 6 dígitos:")
            verification_code = input("Código: ").strip()
            
            # Paso 2: Resetear contraseña con el código
            print("\n🔐 Paso 2: Reseteando contraseña...")
            reset_data = {
                "email": TEST_EMAIL,
                "code": verification_code,
                "new_password": TEST_PASSWORD,
                "new_password2": TEST_PASSWORD
            }
            
            response = requests.post(f"{BASE_URL}/reset-password/", 
                                   json=reset_data,
                                   headers={'Content-Type': 'application/json'})
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                print("✅ Contraseña actualizada exitosamente")
                
                # Paso 3: Probar login con nueva contraseña
                print("\n🔑 Paso 3: Probando login con nueva contraseña...")
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
                    print("✅ Login exitoso con nueva contraseña")
                    print("\n🎉 ¡Prueba completada exitosamente!")
                else:
                    print("❌ Error en el login")
            else:
                print("❌ Error al resetear contraseña")
        else:
            print("❌ Error al solicitar código")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se puede conectar al servidor")
        print("Asegúrate de que el servidor Django esté ejecutándose en http://localhost:8000")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

def test_invalid_scenarios():
    print("\n🧪 Probando escenarios inválidos...\n")
    
    # Test 1: Email inexistente
    print("Test 1: Email inexistente")
    response = requests.post(f"{BASE_URL}/request-password-reset/", 
                           json={"email": "noexiste@example.com"},
                           headers={'Content-Type': 'application/json'})
    print(f"Status: {response.status_code}, Response: {response.json()}")
    
    # Test 2: Código inválido
    print("\nTest 2: Código inválido")
    response = requests.post(f"{BASE_URL}/reset-password/", 
                           json={
                               "email": TEST_EMAIL,
                               "code": "000000",
                               "new_password": "test123",
                               "new_password2": "test123"
                           },
                           headers={'Content-Type': 'application/json'})
    print(f"Status: {response.status_code}, Response: {response.json()}")
    
    # Test 3: Contraseñas no coinciden
    print("\nTest 3: Contraseñas no coinciden")
    response = requests.post(f"{BASE_URL}/reset-password/", 
                           json={
                               "email": TEST_EMAIL,
                               "code": "123456",
                               "new_password": "password1",
                               "new_password2": "password2"
                           },
                           headers={'Content-Type': 'application/json'})
    print(f"Status: {response.status_code}, Response: {response.json()}")

if __name__ == "__main__":
    print("🚀 Script de prueba para recuperación de contraseña - MedPal")
    print("=" * 60)
    
    choice = input("\n¿Qué quieres probar?\n1. Flujo completo de recuperación\n2. Escenarios inválidos\n3. Ambos\nElige (1/2/3): ")
    
    if choice == "1":
        test_password_reset_flow()
    elif choice == "2":
        test_invalid_scenarios()
    elif choice == "3":
        test_password_reset_flow()
        test_invalid_scenarios()
    else:
        print("Opción inválida")