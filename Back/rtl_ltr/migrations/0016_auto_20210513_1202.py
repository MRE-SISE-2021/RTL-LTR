# Generated by Django 3.2.2 on 2021-05-13 09:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtl_ltr', '0015_auto_20210511_1432'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='participant',
            name='browser_type',
        ),
        migrations.AddField(
            model_name='participant',
            name='browser',
            field=models.CharField(db_column='Browser', max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='participant',
            name='city',
            field=models.CharField(db_column='City', max_length=50, null=True),
        ),
    ]
