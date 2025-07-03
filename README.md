# 📅 Project Horario

Proyecto de desarrollo fullstack con:

- Backend: Django + Django REST Framework
- Frontend: React + Vite
- Control de versiones: Git + GitHub

---

## 🚀 Flujo de trabajo Git

Este proyecto sigue un flujo profesional de ramas:

- `main`: código estable en producción.
- `confirm`: rama previa a producción (última revisión).
- `test`: rama de pruebas de integración.
- `develop`: integración de nuevas funcionalidades.
- `feature/nombre`: ramas personales de desarrollo.

---

## 🛠 Cómo colaborar

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/EmanuelRealGamboa/medPal.git
cd project-horario


2️⃣ Crear tu rama de trabajo personal
bash
Copiar código
git checkout develop
git pull origin develop
git checkout -b feature/tu-nombre
git push -u origin feature/tu-nombre


3️⃣ Trabajo diario
Trabaja siempre en tu rama feature/tu-nombre.

Realiza commits frecuentes.

Empuja los cambios:

bash
Copiar código
git add .
git commit -m "Descripción clara del cambio"
git push


4️⃣ Al finalizar una tarea
Crear un Pull Request hacia develop.

Esperar revisión y aprobación del equipo.


📝 Reglas de trabajo
Nunca trabajar directamente en main, test, confirm o develop.

Actualizar el código antes de empezar (hacer git pull origin develop).

Usar mensajes de commit descriptivos.

Evitar commits grandes, preferir commits pequeños y frecuentes.


👥 Integrantes del equipo

Emanuel

Ramses

dayana

jonathan

Gulmaro

Freddy

fatima

yatziri

Json







##Codigo Logout por termminal para tokens (Logout)
curl -X POST http://127.0.0.1:8000/accounts/logout/ \
     -H "Authorization: Token fe9370685335c3036425b044f2ca05d270c4e6f0" \
     -H "Content-Type: application/json" \
     -d "{}"

# Importar tema personalizado del admin interface
python manage.py loaddata themes.json