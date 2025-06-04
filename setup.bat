@echo off
setlocal EnableDelayedExpansion

:: ==========================
:: Configuración inicial
:: ==========================

:: ==========================
:: Crear entorno virtual
:: ==========================
echo 🐍 Creando entorno virtual...
python -m venv venv

:: Activar entorno virtual (Windows)
call venv\Scripts\activate

:: ==========================
:: Instalar dependencias
:: ==========================
echo 📦 Instalando dependencias de backend...
python -m pip install --upgrade pip
pip install -r requirements.txt

:: ==========================
:: Crear rama personal
:: ==========================
set /p nombre=👤 Ingresa tu nombre para crear tu rama personal (feature/tu-nombre): 

git checkout develop
git pull origin develop
git checkout -b feature/%nombre%
git push -u origin feature/%nombre%

:: ==========================
:: Fin del proceso
:: ==========================
echo.
echo ✅ Setup completo.
echo Ya puedes empezar a trabajar en tu rama feature/%nombre%

pause
