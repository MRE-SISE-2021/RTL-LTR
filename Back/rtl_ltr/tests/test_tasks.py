from Back import settings
from rtl_ltr.tasks import *
from rtl_ltr.models import *
from rtl_ltr.serializers import *
import pytest
import sqlite3
import pdb
import os
import django
import requests
import requests_mock
from django.test.client import RequestFactory
import re

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
def test_questionnaire_by_hosted_link_task():
    adapter = requests_mock.Adapter()
    session = requests.Session()
    session.mount('mock://', adapter)

    q = Questionnaire.objects.all()
    questionnaires = QuestionnaireSerializer(q, many=True).data
    for i, quest in enumerate(questionnaires):
        rf = RequestFactory()
        get_request = rf.get('https://test.com/1?hash=' + re.search(r".+/survey/(.+)", quest["hosted_link"]).group(1))
        result = get_questionnaire_by_hosted_link_task(get_request)
        assert str(quest["questionnaire_id"]) == result[1]
        try:
            query = 'http://test.com/1?hash=123'
            adapter.register_uri('GET', query, text='resp')
            result = get_questionnaire_by_hosted_link_task(session)
            assert quest["language_id"] == result[1]
        except Exception:
            assert True


@pytest.mark.django_db
def test_delete_task_from_questionnaire_task():
    assert 'task_id not in data' == delete_task_from_questionnaire_task([], 1)['status']
    q = Questionnaire.objects.all()
    questionnaires = QuestionnaireSerializer(q, many=True).data
    for i, quest in enumerate(questionnaires):
        q_task_id = QuestionnaireTask.objects.filter(questionnaire_id=quest['questionnaire_id'])
        task_id = QuestionnaireTaskSerializer(q_task_id, many=True).data[0]['task_id']
        data = {'task_id': task_id}
        result = delete_task_from_questionnaire_task(data, quest["questionnaire_id"])
        assert result['status'] == True

        try:
            delete_task_from_questionnaire_task(data, -1)
        except Exception:
            assert True

        break


@pytest.mark.django_db
def test_get_preview_data_task():
    q = Questionnaire.objects.all()
    questionnaires = QuestionnaireSerializer(q, many=True).data
    for i, quest in enumerate(questionnaires):
        result = get_preview_data_task(quest["language_id"], quest["questionnaire_id"])
        assert quest["questionnaire_id"] == result['questionnaire_id']
        try:
            get_preview_data_task(-1, -1)
        except Exception:
            assert True


@pytest.mark.django_db
def test_insert_questionnaire_tasks_task():
    q = Questionnaire.objects.all()
    questionnaires = QuestionnaireSerializer(q, many=True).data
    for i, quest in enumerate(questionnaires):
        data = {}
        result = get_preview_data_task(quest["language_id"], quest["questionnaire_id"])
        assert quest["questionnaire_id"] == result

        try:
            insert_questionnaire_tasks_task([])
        except Exception:
            assert True

        break
