@echo off
setlocal EnableDelayedExpansion

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

:: Pedir nombre y convertirlo: primera letra mayúscula, las demás minúsculas
set /p nombre=👤 Ingresa tu nombre para crear tu rama personal (feature/tu-nombre): 

:: Convertir todo a minúsculas primero
for %%A in (A B C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
    set "nombre=!nombre:%%A=%%A!"
)

:: Separar primera letra y resto
set "primera=!nombre:~0,1!"
set "resto=!nombre:~1!"

:: Convertir primera letra a mayúscula si es necesario
for %%L in (a b c d e f g h i j k l m n o p q r s t u v w x y z) do (
    if /i "!primera!"=="%%L" (
        for %%U in (A B C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
            if /i "%%L"=="!primera!" (
                set "primera=%%U"
            )
        )
    )
)

:: Reconstruir el nombre formateado
set "nombre=!primera!!resto!"

git checkout -b feature/!nombre!
git push -u origin feature/!nombre!

echo ====================================
echo Setup completo.
echo Trabajando en feature/!nombre!

endlocal
pause