from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='contactoEmergenciaNombre',
            field=models.CharField(
                max_length=100,
                default='Nombre del contacto'
            ),
        ),
    ]