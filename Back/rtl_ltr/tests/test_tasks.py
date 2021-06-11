from Back import settings
from rtl_ltr.tasks import *
from rtl_ltr.models import *
from rtl_ltr.serializers import *
import pytest
import sqlite3
import pdb
import os
import django

django.setup()
os.environ['DJANGO_SETTINGS_MODULE'] = 'Back.settings'


@pytest.fixture(scope='session')
def django_db_setup():
    settings.DATABASES['default'] = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'D:\\fourth_year_SISE\\Diploma_Project\\RTL-LTR\\BidiResearchSQLiteDB',
    }


@pytest.mark.django_db
def test_get_questionnaires_table_task():
    result = get_questionnaires_table_task.apply().get()
    q = Questionnaire.objects.all()
    questionnaires = QuestionnaireSerializer(q, many=True).data
    for i, quest in enumerate(questionnaires):
        assert quest["questionnaire_id"] == result[i]['questionnaire_id']


@pytest.mark.django_db
def test_get_questionnaire_task():
    q = Questionnaire.objects.all()
    questionnaires = QuestionnaireSerializer(q, many=True).data
    for i, quest in enumerate(questionnaires):
        result = get_questionnaire_task(quest["questionnaire_id"])
        assert quest["questionnaire_id"] == result['questionnaire_id']


@pytest.mark.django_db
def test_get_preview_data_task():
    q = Questionnaire.objects.all()
    questionnaires = QuestionnaireSerializer(q, many=True).data
    for i, quest in enumerate(questionnaires):
        result = get_preview_data_task(quest["language_id"], quest["questionnaire_id"])
        assert quest["questionnaire_id"] == result['questionnaire_id']
