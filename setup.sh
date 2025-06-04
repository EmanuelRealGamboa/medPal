#!/bin/bash

echo "🚀 Creando entorno virtual..."
python3 -m venv venv
source venv/bin/activate

echo "📦 Instalando dependencias..."
pip install --upgrade pip
pip install -r requirements.txt

echo "🔄 Sincronizando ramas..."
git checkout main
git pull origin main
git checkout develop
git pull origin develop
git merge main
git push origin develop

read -p "👤 Ingresa tu nombre para crear tu rama personal (feature/tu-nombre): " nombre

git checkout -b feature/$nombre
git push -u origin feature/$nombre

echo "✅ Setup completo. Trabajando en feature/$nombre"
