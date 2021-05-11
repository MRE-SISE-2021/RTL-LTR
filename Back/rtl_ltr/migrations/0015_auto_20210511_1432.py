# Generated by Django 3.2.2 on 2021-05-11 11:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtl_ltr', '0014_alter_questionnaireparticipant_time_spent'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='questionnaireparticipant',
            name='time_spent',
        ),
        migrations.AddField(
            model_name='questionnaireparticipant',
            name='time_spent_seconds',
            field=models.IntegerField(db_column='TimeSpentSeconds', null=True),
        ),
    ]
