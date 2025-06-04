@echo off
setlocal EnableDelayedExpansion

echo ===========================
echo   Creando entorno virtual...
echo ===========================
python -m venv venv
call venv\Scripts\activate

echo ===========================
echo  Instalando dependencias...
echo ===========================
python -m pip install --upgrade pip
pip install -r requirements.txt

echo ===========================
echo Sincronizando ramas...
echo ===========================
git checkout main
git pull origin main
git checkout develop
git pull origin develop
git merge main
git push origin develop

set /p nombre=👤 Ingresa tu nombre para crear tu rama personal (feature/tu-nombre): 

git checkout -b feature/%nombre%
git push -u origin feature/%nombre%

echo.
echo ===========================
echo Setup completo.
echo Trabajando en feature/%nombre%
pause