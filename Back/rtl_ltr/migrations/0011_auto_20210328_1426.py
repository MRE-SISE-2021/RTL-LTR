# Generated by Django 3.1.7 on 2021-03-28 11:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rtl_ltr', '0010_questionnaire_task_type_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='questionnaire',
            name='task_type_id',
        ),
        migrations.RemoveField(
            model_name='task',
            name='task_type_id',
        ),
        migrations.AddField(
            model_name='task',
            name='language_id',
            field=models.ForeignKey(db_column='LanguageId', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='rtl_ltr.language'),
        ),
        migrations.DeleteModel(
            name='TaskType',
        ),
    ]