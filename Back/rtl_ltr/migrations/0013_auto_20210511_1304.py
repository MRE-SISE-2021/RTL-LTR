# Generated by Django 3.2.2 on 2021-05-11 10:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtl_ltr', '0012_auto_20210511_1301'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='questionnaireparticipant',
            name='test_finished',
        ),
        migrations.AddField(
            model_name='questionnaireparticipant',
            name='test_completed',
            field=models.DateTimeField(db_column='TestCompleted', null=True),
        ),
    ]