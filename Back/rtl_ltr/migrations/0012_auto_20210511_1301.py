# Generated by Django 3.2.2 on 2021-05-11 10:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtl_ltr', '0011_auto_20210510_2339'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='questionnaireparticipant',
            name='questionnaire_finish',
        ),
        migrations.AddField(
            model_name='questionnaireparticipant',
            name='test_finished',
            field=models.DateTimeField(db_column='TestFinished', null=True),
        ),
    ]
