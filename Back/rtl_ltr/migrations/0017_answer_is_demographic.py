# Generated by Django 3.2.2 on 2021-05-13 14:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtl_ltr', '0016_auto_20210513_1202'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='is_demographic',
            field=models.BooleanField(db_column='IsDemographic', default=False),
        ),
    ]
