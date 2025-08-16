from django.db import migrations, connection

def add_col(apps, schema_editor):
    # Agrega la columna si no existe (compatible con MySQL 5.7/8)
    with connection.cursor() as cursor:
        cursor.execute("SHOW COLUMNS FROM accounts_user LIKE 'photoUser';")
        exists = cursor.fetchone()
        if not exists:
            # ImageField en Django usa por defecto VARCHAR(100)
            cursor.execute(
                "ALTER TABLE accounts_user "
                "ADD COLUMN photoUser VARCHAR(100) NULL;"
            )

def drop_col(apps, schema_editor):
    with connection.cursor() as cursor:
        cursor.execute("SHOW COLUMNS FROM accounts_user LIKE 'photoUser';")
        if cursor.fetchone():
            cursor.execute("ALTER TABLE accounts_user DROP COLUMN photoUser;")

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_add_contacto_emergencia'),  # ← asegura que apunta a la última aplicada
    ]

    operations = [
        migrations.RunPython(add_col, drop_col),
    ]
