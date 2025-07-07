#!/usr/bin/env python3
"""
Script de prueba para verificar la funcionalidad de inicio de sesión
Ejecuta este script después de iniciar el servidor Django
"""

import requests
import json
import time

# Configuración
BASE_URL = "http://localhost:8000/accounts"
TEST_EMAIL = "josueramsesrojasvallejo@gmail.com"
TEST_PASSWORD = "rojas2004"

def test_signin_flow():
    print("🔄 Iniciando prueba de inicio de sesión...\n")
    
    # Paso 1: Intentar login
    print("🔑 Paso 1: Intentando iniciar sesión...")
    login_data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }
    
    try:
        response = requests.post(f"{BASE_URL}/signin/", 
                               json=login_data,
                               headers={'Content-Type': 'application/json'})
        
        print(f"Status Code: {response.status_code}")
        response_data = response.json()
        print(f"Response: {response_data}")
        
        if response.status_code == 200:
            print("✅ Login exitoso")
            
            # Extraer token para pruebas adicionales
            token = response_data.get('token')
            if token:
                print(f"🔐 Token obtenido: {token[:20]}...")
                
                # Paso 2: Probar acceso a endpoint protegido (si existe)
                print("\n🛡️ Paso 2: Probando acceso con token...")
                headers = {
                    'Authorization': f'Token {token}',
                    'Content-Type': 'application/json'
                }
                
                # Intentar acceder a un endpoint que requiera autenticación
                response = requests.get(f"{BASE_URL}/profile/", headers=headers)
                print(f"Status Code: {response.status_code}")
                
                if response.status_code == 200:
                    print("✅ Acceso autorizado exitoso")
                    print(f"Datos del perfil: {response.json()}")
                elif response.status_code == 404:
                    print("ℹ️ Endpoint de perfil no encontrado (normal si no está implementado)")
                else:
                    print(f"⚠️ Respuesta inesperada: {response.status_code}")
                
                print("\n🎉 ¡Prueba de login completada exitosamente!")
            else:
                print("⚠️ No se recibió token en la respuesta")
        else:
            print("❌ Error en el login")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se puede conectar al servidor")
        print("Asegúrate de que el servidor Django esté ejecutándose en http://localhost:8000")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

def test_invalid_signin_scenarios():
    print("\n🧪 Probando escenarios inválidos de login...\n")
    
    # Test 1: Email inexistente
    print("Test 1: Email inexistente")
    response = requests.post(f"{BASE_URL}/signin/", 
                           json={
                               "email": "noexiste@example.com",
                               "password": "cualquier_password"
                           },
                           headers={'Content-Type': 'application/json'})
    print(f"Status: {response.status_code}, Response: {response.json()}")
    
    # Test 2: Contraseña incorrecta
    print("\nTest 2: Contraseña incorrecta")
    response = requests.post(f"{BASE_URL}/signin/", 
                           json={
                               "email": TEST_EMAIL,
                               "password": "password_incorrecto"
                           },
                           headers={'Content-Type': 'application/json'})
    print(f"Status: {response.status_code}, Response: {response.json()}")
    
    # Test 3: Campos faltantes
    print("\nTest 3: Email faltante")
    response = requests.post(f"{BASE_URL}/signin/", 
                           json={
                               "password": TEST_PASSWORD
                           },
                           headers={'Content-Type': 'application/json'})
    print(f"Status: {response.status_code}, Response: {response.json()}")
    
    # Test 4: Contraseña faltante
    print("\nTest 4: Contraseña faltante")
    response = requests.post(f"{BASE_URL}/signin/", 
                           json={
                               "email": TEST_EMAIL
                           },
                           headers={'Content-Type': 'application/json'})
    print(f"Status: {response.status_code}, Response: {response.json()}")

def test_logout_flow():
    print("\n🚪 Probando logout...\n")
    
    # Primero hacer login para obtener token
    login_data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }
    
    try:
        response = requests.post(f"{BASE_URL}/signin/", 
                               json=login_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            token = response.json().get('token')
            if token:
                print(f"🔐 Token obtenido para logout: {token[:20]}...")
                
                # Intentar logout
                headers = {
                    'Authorization': f'Token {token}',
                    'Content-Type': 'application/json'
                }
                
                response = requests.post(f"{BASE_URL}/signout/", headers=headers)
                print(f"Logout Status Code: {response.status_code}")
                
                if response.status_code == 200:
                    print("✅ Logout exitoso")
                else:
                    print(f"Response: {response.json()}")
            else:
                print("❌ No se pudo obtener token para logout")
        else:
            print("❌ No se pudo hacer login para probar logout")
            
    except Exception as e:
        print(f"❌ Error en logout: {e}")

if __name__ == "__main__":
    print("🚀 Script de prueba para inicio de sesión - MedPal")
    print("=" * 60)
    
    choice = input("\n¿Qué quieres probar?\n1. Flujo de login\n2. Escenarios inválidos\n3. Logout\n4. Todo\nElige (1/2/3/4): ")
    
    if choice == "1":
        test_signin_flow()
    elif choice == "2":
        test_invalid_signin_scenarios()
    elif choice == "3":
        test_logout_flow()
    elif choice == "4":
        test_signin_flow()
        test_invalid_signin_scenarios()
        test_logout_flow()
    else:
        print("Opción inválida")