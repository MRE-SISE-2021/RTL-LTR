# Generated by Django 3.2.2 on 2021-06-16 16:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtl_ltr', '0019_alter_questionnaireparticipant_time_spent_seconds'),
    ]

    operations = [
        migrations.CreateModel(
            name='UsersLoginLog',
            fields=[
                ('users_login_log_id', models.AutoField(db_column='UsersLoginLogId', primary_key=True, serialize=False)),
                ('user_id', models.IntegerField(db_column='UserId')),
                ('login_date', models.DateTimeField(db_column='LoginDate')),
            ],
            options={
                'db_table': 'UsersLoginLog',
                'unique_together': {('user_id', 'login_date')},
            },
        ),
    ]
