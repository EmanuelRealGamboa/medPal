@echo off
echo ====================================
echo Creando entorno virtual...
echo ====================================

python -m venv env
call env\Scripts\activate.bat

echo ====================================
echo Instalando dependencias...
echo ====================================

python -m pip install --upgrade pip
pip install -r requirements.txt

echo ====================================
echo Sincronizando ramas...
echo ====================================

git fetch --all

git checkout main
git pull origin main

git rev-parse --verify develop >nul 2>&1
if %errorlevel%==0 (
  git checkout develop
  git pull origin develop
) else (
  git checkout -b develop origin/develop
)

git merge main
git push origin develop

set /p nombre=👤 Ingresa tu nombre para crear tu rama personal (feature/tu-nombre): 
git checkout -b feature/%nombre%
git push -u origin feature/%nombre%

echo ====================================
echo Setup completo.
echo Trabajando en feature/%nombre%