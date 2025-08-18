#!/usr/bin/env python3
"""
Script maestro para probar todas las funcionalidades de autenticación
Ejecuta este script después de iniciar el servidor Django
"""

import requests
import json
import time
import sys
import os

# Configuración
BASE_URL = "http://localhost:8000/accounts"
TEST_EMAIL = "josueramsesrojasvallejo@gmail.com"
TEST_PASSWORD = "testpassword123"
TEST_FIRST_NAME = "Usuario"
TEST_LAST_NAME = "Prueba"


def check_server_connection():
    """Verifica si el servidor está ejecutándose"""
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        return True
    except:
        return False

def test_complete_auth_flow():
    """Prueba el flujo completo de autenticación"""
    print("🚀 Iniciando prueba completa de autenticación...\n")
    
    if not check_server_connection():
        print("❌ Error: No se puede conectar al servidor")
        print("Asegúrate de que el servidor Django esté ejecutándose en http://localhost:8000")
        return False
    
    print("✅ Conexión al servidor establecida\n")
    
    # Paso 1: Registro
    print("📝 PASO 1: Registro de usuario")
    print("-" * 40)
    signup_data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
        "password2": TEST_PASSWORD,
        "first_name": TEST_FIRST_NAME,
        "last_name": TEST_LAST_NAME
    }
    
    try:
        response = requests.post(f"{BASE_URL}/signup/", 
                               json=signup_data,
                               headers={'Content-Type': 'application/json'})
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 201:
            print("✅ Usuario registrado exitosamente\n")
        else:
            print("❌ Error en el registro")
            if response.status_code == 400:
                print("ℹ️ El usuario probablemente ya existe, continuando con las pruebas...\n")
            else:
                return False
    
    except Exception as e:
        print(f"❌ Error en registro: {e}")
        return False
    
    # Paso 2: Verificación de código (si es necesario)
    print("🔐 PASO 2: Verificación de código")
    print("-" * 40)
    print("Si necesitas verificar tu cuenta, revisa tu correo e ingresa el código.")
    verify_choice = input("¿Tienes un código para verificar? (s/n): ").lower().strip()
    
    if verify_choice == 's':
        verification_code = input("Ingresa el código de 6 dígitos: ").strip()
        
        verify_data = {
            "email": TEST_EMAIL,
            "code": verification_code
        }
        
        try:
            response = requests.post(f"{BASE_URL}/verify-code/", 
                                   json=verify_data,
                                   headers={'Content-Type': 'application/json'})
            
            print(f"Status: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                print("✅ Código verificado exitosamente\n")
            else:
                print("❌ Error al verificar código\n")
        
        except Exception as e:
            print(f"❌ Error en verificación: {e}\n")
    
    # Paso 3: Login
    print("🔑 PASO 3: Inicio de sesión")
    print("-" * 40)
    login_data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }
    
    try:
        response = requests.post(f"{BASE_URL}/signin/", 
                               json=login_data,
                               headers={'Content-Type': 'application/json'})
        
        print(f"Status: {response.status_code}")
        response_data = response.json()
        print(f"Response: {response_data}")
        
        if response.status_code == 200:
            print("✅ Login exitoso")
            token = response_data.get('token')
            
            if token:
                print(f"🔐 Token obtenido: {token[:20]}...\n")
                
                # Paso 4: Logout
                print("🚪 PASO 4: Cerrar sesión")
                print("-" * 40)
                
                headers = {
                    'Authorization': f'Token {token}',
                    'Content-Type': 'application/json'
                }
                
                response = requests.post(f"{BASE_URL}/signout/", headers=headers)
                print(f"Status: {response.status_code}")
                
                if response.status_code == 200:
                    print("✅ Logout exitoso\n")
                else:
                    print(f"Response: {response.json()}\n")
                
                print("🎉 ¡Flujo completo de autenticación completado exitosamente!")
                return True
            else:
                print("⚠️ No se recibió token\n")
                return False
        else:
            print("❌ Error en el login\n")
            return False
    
    except Exception as e:
        print(f"❌ Error en login: {e}")
        return False

def test_password_reset_flow():
    """Prueba el flujo de recuperación de contraseña"""
    print("\n🔄 PRUEBA DE RECUPERACIÓN DE CONTRASEÑA")
    print("=" * 50)
    
    # Solicitar código de recuperación
    print("📧 Solicitando código de recuperación...")
    reset_request_data = {
        "email": TEST_EMAIL
    }
    
    try:
        response = requests.post(f"{BASE_URL}/request-password-reset/", 
                               json=reset_request_data,
                               headers={'Content-Type': 'application/json'})
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Código de recuperación enviado")
            
            # Solicitar código al usuario
            reset_code = input("\nIngresa el código de recuperación: ").strip()
            new_password = "nueva_password123"
            
            reset_data = {
                "email": TEST_EMAIL,
                "code": reset_code,
                "new_password": new_password,
                "new_password2": new_password
            }
            
            response = requests.post(f"{BASE_URL}/reset-password/", 
                                   json=reset_data,
                                   headers={'Content-Type': 'application/json'})
            
            print(f"Status: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                print("✅ Contraseña actualizada exitosamente")
                return True
            else:
                print("❌ Error al actualizar contraseña")
                return False
        else:
            print("❌ Error al solicitar código de recuperación")
            return False
    
    except Exception as e:
        print(f"❌ Error en recuperación de contraseña: {e}")
        return False

def main():
    print("🏥 MEDPAL - SUITE DE PRUEBAS DE AUTENTICACIÓN")
    print("=" * 60)
    print(f"Servidor: {BASE_URL}")
    print(f"Email de prueba: {TEST_EMAIL}")
    print("=" * 60)
    
    choice = input("\n¿Qué quieres probar?\n"
                  "1. Flujo completo de autenticación\n"
                  "2. Recuperación de contraseña\n"
                  "3. Ambos\n"
                  "Elige (1/2/3): ")
    
    if choice == "1":
        test_complete_auth_flow()
    elif choice == "2":
        test_password_reset_flow()
    elif choice == "3":
        success1 = test_complete_auth_flow()
        if success1:
            test_password_reset_flow()
    else:
        print("Opción inválida")

if __name__ == "__main__":
    main()