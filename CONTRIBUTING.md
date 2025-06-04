 📝 Guía de contribución - Project Horario

Este documento define las reglas internas de trabajo colaborativo con Git para este proyecto.

---

## 🔧 Flujo de ramas

- **main** → Producción estable
- **confirm** → Última revisión previa a producción
- **test** → Pruebas de integración
- **develop** → Desarrollo integrado
- **feature/** → Ramas de cada integrante

---

## 🚩 Reglas de trabajo diario

1️⃣ **Siempre trabajar en tu propia rama `feature/tu-nombre`.**

2️⃣ **Mantener la rama actualizada antes de trabajar:**

```bash
git checkout develop
git pull origin develop
git checkout feature/tu-nombre
git merge develop


3️⃣ Realizar commits frecuentes y descriptivos:

bash
Copiar código
git add .
git commit -m "feat: implement user login feature"
4️⃣ Empujar los cambios a tu rama remota:

bash
Copiar código
git push origin feature/tu-nombre


🚀 Creación de Pull Requests (PR)
Al finalizar una tarea, crear un Pull Request desde tu rama feature/tu-nombre hacia develop.

Asignar un revisor del equipo.

No hacer merge directamente sin revisión.




🔥 Reglas de commits
Usar el siguiente formato:

php-template
Copiar código
<tipo>: <mensaje corto descriptivo>
Ejemplos de tipos:
Tipo	Descripción
feat	Nueva funcionalidad
fix	Corrección de bug
refactor	Reestructuración de código
docs	Documentación
test	Tests unitarios
chore	Tareas de mantenimiento




Ejemplos de mensajes:
feat: implementación de login

fix: corrección en validación de email

docs: actualización del README

refactor: optimización de queries




⚠ Buenas prácticas
No trabajar directamente en main, test, confirm o develop.

Hacer pull diario para mantener el código actualizado.

No subir credenciales o archivos sensibles.

Toda funcionalidad nueva debe incluir pruebas.




💬 Comunicación
Usar los Pull Requests para discutir cambios.

Documentar claramente los cambios realizados.

Consultar con el líder de proyecto ante dudas sobre integración.