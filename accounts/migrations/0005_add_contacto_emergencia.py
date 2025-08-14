from django.db import migrations, connection

def add_col(apps, schema_editor):
    with connection.cursor() as cursor:
        cursor.execute("SHOW COLUMNS FROM accounts_user LIKE 'contactoEmergencia';")
        exists = cursor.fetchone()
        if not exists:
            cursor.execute(
                "ALTER TABLE accounts_user "
                "ADD COLUMN contactoEmergencia VARCHAR(10) NOT NULL DEFAULT '0000000000';"
            )

def drop_col(apps, schema_editor):
    with connection.cursor() as cursor:
        cursor.execute("SHOW COLUMNS FROM accounts_user LIKE 'contactoEmergencia';")
        exists = cursor.fetchone()
        if exists:
            cursor.execute("ALTER TABLE accounts_user DROP COLUMN contactoEmergencia;")

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_remove_user_nombrecontacoemergencia_and_more'),
    ]

    operations = [
        migrations.RunPython(add_col, drop_col),
    ]
