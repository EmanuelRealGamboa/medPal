#!/usr/bin/env python3
"""
Script de prueba para verificar la funcionalidad de logout (cerrar sesión)
Ejecuta este script después de iniciar el servidor Django
"""

import requests
import json
import time

# Configuración
BASE_URL = "http://localhost:8000/accounts"
TEST_EMAIL = "josueramsesrojasvallejo@gmail.com"
TEST_PASSWORD = "rojas2004"

def get_auth_token():
    """Función auxiliar para obtener un token de autenticación"""
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
            return token
        else:
            print(f"❌ Error al hacer login: {response.status_code}")
            print(f"Response: {response.json()}")
            return None
    except Exception as e:
        print(f"❌ Error en login: {e}")
        return None

def test_logout_flow():
    print("🔄 Iniciando prueba de logout...\n")
    
    # Paso 1: Obtener token de autenticación
    print("🔑 Paso 1: Obteniendo token de autenticación...")
    token = get_auth_token()
    
    if not token:
        print("❌ No se pudo obtener token. Verifica que el usuario exista y las credenciales sean correctas.")
        return False
    
    print(f"✅ Token obtenido: {token[:20]}...")
    
    # Paso 2: Realizar logout
    print("\n🚪 Paso 2: Realizando logout...")
    headers = {
        'Authorization': f'Token {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(f"{BASE_URL}/logout/", 
                               headers=headers)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Logout exitoso")
            try:
                response_data = response.json()
                print(f"Response: {response_data}")
            except:
                print("Response: Logout exitoso (sin contenido JSON)")
            
            # Paso 3: Verificar que el token ya no es válido
            print("\n🔒 Paso 3: Verificando que el token ya no es válido...")
            test_response = requests.get(f"{BASE_URL}/profile/", headers=headers)
            
            print(f"Test Status Code: {test_response.status_code}")
            
            if test_response.status_code == 401:
                print("✅ Token invalidado correctamente")
                print("\n🎉 ¡Logout completado exitosamente!")
                return True
            elif test_response.status_code == 404:
                print("ℹ️ Endpoint de perfil no encontrado, pero el logout fue exitoso")
                return True
            else:
                print(f"⚠️ Token aún válido o respuesta inesperada: {test_response.status_code}")
                try:
                    print(f"Response: {test_response.json()}")
                except:
                    print("No se pudo obtener respuesta JSON")
                return False
        else:
            print("❌ Error en logout")
            try:
                print(f"Response: {response.json()}")
            except:
                print("No se pudo obtener respuesta JSON")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se puede conectar al servidor")
        print("Asegúrate de que el servidor Django esté ejecutándose en http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def test_invalid_logout_scenarios():
    print("\n🧪 Probando escenarios inválidos de logout...\n")
    
    # Test 1: Logout sin token
    print("Test 1: Logout sin token de autorización")
    try:
        response = requests.post(f"{BASE_URL}/logout/", 
                               headers={'Content-Type': 'application/json'})
        print(f"Status: {response.status_code}")
        try:
            print(f"Response: {response.json()}")
        except:
            print("Response: Sin contenido JSON")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 2: Logout con token inválido
    print("\nTest 2: Logout con token inválido")
    try:
        headers = {
            'Authorization': 'Token token_invalido_123456789',
            'Content-Type': 'application/json'
        }
        response = requests.post(f"{BASE_URL}/logout/", headers=headers)
        print(f"Status: {response.status_code}")
        try:
            print(f"Response: {response.json()}")
        except:
            print("Response: Sin contenido JSON")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 3: Logout con formato de autorización incorrecto
    print("\nTest 3: Logout con formato de autorización incorrecto")
    try:
        headers = {
            'Authorization': 'Bearer token_incorrecto',  # Debería ser 'Token'
            'Content-Type': 'application/json'
        }
        response = requests.post(f"{BASE_URL}/logout/", headers=headers)
        print(f"Status: {response.status_code}")
        try:
            print(f"Response: {response.json()}")
        except:
            print("Response: Sin contenido JSON")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 4: Doble logout (logout con token ya invalidado)
    print("\nTest 4: Doble logout (token ya invalidado)")
    token = get_auth_token()
    if token:
        headers = {
            'Authorization': f'Token {token}',
            'Content-Type': 'application/json'
        }
        
        # Primer logout
        response1 = requests.post(f"{BASE_URL}/logout/", headers=headers)
        print(f"Primer logout - Status: {response1.status_code}")
        
        # Segundo logout con el mismo token
        response2 = requests.post(f"{BASE_URL}/logout/", headers=headers)
        print(f"Segundo logout - Status: {response2.status_code}")
        try:
            print(f"Response: {response2.json()}")
        except:
            print("Response: Sin contenido JSON")
    else:
        print("No se pudo obtener token para la prueba")

def test_logout_and_login_cycle():
    print("\n🔄 Probando ciclo completo: Login -> Logout -> Login...\n")
    
    # Paso 1: Login inicial
    print("🔑 Paso 1: Login inicial...")
    token1 = get_auth_token()
    if not token1:
        print("❌ No se pudo hacer login inicial")
        return False
    print(f"✅ Token 1 obtenido: {token1[:20]}...")
    
    # Paso 2: Logout
    print("\n🚪 Paso 2: Logout...")
    headers = {
        'Authorization': f'Token {token1}',
        'Content-Type': 'application/json'
    }
    
    response = requests.post(f"{BASE_URL}/logout/", headers=headers)
    if response.status_code == 200:
        print("✅ Logout exitoso")
    else:
        print(f"❌ Error en logout: {response.status_code}")
        return False
    
    # Paso 3: Nuevo login
    print("\n🔑 Paso 3: Nuevo login después del logout...")
    token2 = get_auth_token()
    if not token2:
        print("❌ No se pudo hacer login después del logout")
        return False
    print(f"✅ Token 2 obtenido: {token2[:20]}...")
    
    # Verificar que los tokens son diferentes (opcional)
    if token1 != token2:
        print("✅ Los tokens son diferentes (comportamiento esperado)")
    else:
        print("ℹ️ Los tokens son iguales (puede ser normal dependiendo de la implementación)")
    
    print("\n🎉 ¡Ciclo completo Login->Logout->Login exitoso!")
    return True

if __name__ == "__main__":
    print("🚀 Script de prueba para logout - MedPal")
    print("=" * 60)
    print(f"Servidor: {BASE_URL}")
    print(f"Email de prueba: {TEST_EMAIL}")
    print("=" * 60)
    
    choice = input("\n¿Qué quieres probar?\n"
                  "1. Flujo básico de logout\n"
                  "2. Escenarios inválidos\n"
                  "3. Ciclo Login->Logout->Login\n"
                  "4. Todas las pruebas\n"
                  "Elige (1/2/3/4): ")
    
    if choice == "1":
        test_logout_flow()
    elif choice == "2":
        test_invalid_logout_scenarios()
    elif choice == "3":
        test_logout_and_login_cycle()
    elif choice == "4":
        success1 = test_logout_flow()
        test_invalid_logout_scenarios()
        if success1:
            test_logout_and_login_cycle()
    else:
        print("Opción inválida")