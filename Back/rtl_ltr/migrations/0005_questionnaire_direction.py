# Generated by Django 3.1.7 on 2021-03-24 15:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtl_ltr', '0004_auto_20210315_1849'),
    ]

    operations = [
        migrations.AddField(
            model_name='questionnaire',
            name='direction',
            field=models.TextField(db_column='Direction', default=1),
            preserve_default=False,
        ),
    ]
