#!/usr/bin/env python3
"""
Script de prueba para verificar la funcionalidad de verificación de código
Ejecuta este script después de iniciar el servidor Django
"""

import requests
import json
import time

# Configuración
BASE_URL = "http://localhost:8000/accounts"
TEST_EMAIL = "rojasvallejo.josueramses@utacapulco.edu.mx"

def test_verify_code_flow():
    print("🔄 Iniciando prueba de verificación de código...\n")
    
    print("📧 Para probar la verificación de código, necesitas tener un código pendiente.")
    print("Puedes obtener uno registrándote o solicitando recuperación de contraseña.\n")
    
    # Solicitar al usuario que ingrese el código
    print("📱 Ingresa el código de verificación de 6 dígitos:")
    verification_code = input("Código: ").strip()
    
    if not verification_code:
        print("❌ Código no puede estar vacío")
        return
    
    # Verificar código
    print("\n🔐 Verificando código...")
    verify_data = {
        "email": TEST_EMAIL,
        "code": verification_code
    }
    
    try:
        response = requests.post(f"{BASE_URL}/verify-code/", 
                               json=verify_data,
                               headers={'Content-Type': 'application/json'})
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Código verificado exitosamente")
            print("\n🎉 ¡Verificación completada!")
        else:
            print("❌ Error al verificar código")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se puede conectar al servidor")
        print("Asegúrate de que el servidor Django esté ejecutándose en http://localhost:8000")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

def test_invalid_verify_scenarios():
    print("\n🧪 Probando escenarios inválidos de verificación...\n")
    
    # Test 1: Código inválido
    print("Test 1: Código inválido")
    response = requests.post(f"{BASE_URL}/verify-code/", 
                           json={
                               "email": TEST_EMAIL,
                               "code": "000000"
                           },
                           headers={'Content-Type': 'application/json'})
    print(f"Status: {response.status_code}, Response: {response.json()}")
    
    # Test 2: Email inexistente
    print("\nTest 2: Email inexistente")
    response = requests.post(f"{BASE_URL}/verify-code/", 
                           json={
                               "email": "noexiste@example.com",
                               "code": "123456"
                           },
                           headers={'Content-Type': 'application/json'})
    print(f"Status: {response.status_code}, Response: {response.json()}")
    
    # Test 3: Código con formato incorrecto
    print("\nTest 3: Código con formato incorrecto")
    response = requests.post(f"{BASE_URL}/verify-code/", 
                           json={
                               "email": TEST_EMAIL,
                               "code": "12345"  # Solo 5 dígitos
                           },
                           headers={'Content-Type': 'application/json'})
    print(f"Status: {response.status_code}, Response: {response.json()}")
    
    # Test 4: Campos faltantes
    print("\nTest 4: Email faltante")
    response = requests.post(f"{BASE_URL}/verify-code/", 
                           json={
                               "code": "123456"
                           },
                           headers={'Content-Type': 'application/json'})
    print(f"Status: {response.status_code}, Response: {response.json()}")

if __name__ == "__main__":
    print("🚀 Script de prueba para verificación de código - MedPal")
    print("=" * 60)
    
    choice = input("\n¿Qué quieres probar?\n1. Verificar código\n2. Escenarios inválidos\n3. Ambos\nElige (1/2/3): ")
    
    if choice == "1":
        test_verify_code_flow()
    elif choice == "2":
        test_invalid_verify_scenarios()
    elif choice == "3":
        test_verify_code_flow()
        test_invalid_verify_scenarios()
    else:
        print("Opción inválida")