#!/bin/bash

echo "===================================="
echo "Creando entorno virtual..."
echo "===================================="

python3 -m venv venv
source venv/bin/activate

echo "===================================="
echo "Instalando dependencias..."
echo "===================================="

python3 -m pip install --upgrade pip
pip install -r requirements.txt

echo "===================================="
echo "Sincronizando ramas..."
echo "===================================="

git fetch --all

# Asegurarse de estar en main y actualizarlo
git checkout main
git pull origin main

# Revisar si develop existe localmente
if git show-ref --quiet refs/heads/develop; then
  git checkout develop
  git pull origin develop
else
  git checkout -b develop origin/develop
fi

# Fusionar main en develop
git merge main
git push origin develop

# Preguntar el nombre de la nueva rama
read -p "👤 Ingresa tu nombre para crear tu rama personal (feature/tu-nombre): " nombre

git checkout -b feature/$nombre
git push -u origin feature/$nombre

echo "===================================="
echo "Setup completo."
echo "Trabajando en feature/$nombre"
