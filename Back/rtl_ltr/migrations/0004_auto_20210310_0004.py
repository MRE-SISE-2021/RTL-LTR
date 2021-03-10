# Generated by Django 3.0 on 2021-03-09 22:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtl_ltr', '0003_auto_20210310_0002'),
    ]

    operations = [
        migrations.AlterField(
            model_name='participant',
            name='ltr_proficiency',
            field=models.FloatField(blank=True, db_column='LtrProficiency', null=True),
        ),
        migrations.AlterField(
            model_name='participant',
            name='rtl_proficiency',
            field=models.FloatField(blank=True, db_column='RtlProficiency', null=True),
        ),
    ]