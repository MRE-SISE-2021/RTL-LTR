# Generated by Django 3.2.2 on 2021-05-11 11:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtl_ltr', '0013_auto_20210511_1304'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='questionnaireparticipant',
            name='time_spent',
        ),

        migrations.AddField(
            model_name='questionnaireparticipant',
            name='time_spent',
            field=models.IntegerField(db_column='TimeSpent', null=True),
        ),
    ]