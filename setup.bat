@echo off
setlocal EnableDelayedExpansion

echo ====================================
echo Creando entorno virtual...
echo ====================================
python -m venv venv
call venv\Scripts\activate

echo ====================================
echo Instalando dependencias...
echo ====================================
python -m pip install --upgrade pip
pip install -r requirements.txt

echo ====================================
echo Sincronizando ramas...
echo ====================================
git fetch --all

:: Aseguramos que estamos en main y lo actualizamos
git checkout main
git pull origin main

:: Creamos develop si no existe localmente
git branch --list develop
IF %ERRORLEVEL% NEQ 0 (
    git checkout -b develop origin/develop
) ELSE (
    git checkout develop
    git pull origin develop
)

:: Fusionamos main en develop (por si hay cambios recientes)
git merge main
git push origin develop

:: Preguntamos el nombre del feature
set /p nombre=👤 Ingresa tu nombre para crear tu rama personal (feature/tu-nombre):

git checkout -b feature/%nombre%
git push -u origin feature/%nombre%

echo ====================================
echo Setup completo.
echo Trabajando en feature/%nombre%
pause