# Generated by Django 3.2.2 on 2021-05-10 20:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rtl_ltr', '0010_taskparticipant_component_type_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='participant',
            name='questionnaire_direction',
            field=models.TextField(db_column='QuestionnaireDirection', null=True),
        ),
        migrations.AlterField(
            model_name='participant',
            name='questionnaire_language',
            field=models.ForeignKey(db_column='QuestionnaireLanguage', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='questionnaire_language', to='rtl_ltr.language'),
        ),
    ]