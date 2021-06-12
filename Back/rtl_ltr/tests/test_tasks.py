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
    max_quest_id = 0
    for i, quest in enumerate(questionnaires):
        if max_quest_id < quest['questionnaire_id']:
            max_quest_id = quest['questionnaire_id']
    data = {'tasks': [],
            'creation_date': '2021-01-06 23:25',
            'questionnaire_name': 'sad',
            'direction': 'RTL',
            'hosted_link': '',
            'is_active': True,
            'language_id': '4',
            'questionnaire_type_id': '1',
            'demographic': {
                'is_age_demo': True,
                'is_native_demo': True,
                'is_other_demo': True,
                'is_knowledge_demo': True,
                'is_daily_demo': True,
                'is_writing_demo': True,
                'is_mobile_demo': True,
                'is_mouse_demo': True,
                'is_design_demo': True,
                'is_hci_demo': True,
                'is_develop_demo': True},
            'task_type_id': '1'}
    result = insert_questionnaire_tasks_task(data)
    assert max_quest_id + 1 == result

    try:
        insert_questionnaire_tasks_task([])
    except Exception:
        assert True


@pytest.mark.django_db
def test_update_questionnaire_tasks_task():
    q = Questionnaire.objects.all()
    questionnaires = QuestionnaireSerializer(q, many=True).data

    for i, quest in enumerate(questionnaires):
        data = {'tasks': [
            {
                'answers': [],
                'order_key': 3,
                'component_type_id': 5,
                'label': 'Stars!',
                'images': [
                    {
                        'image_url': 'Picture'
                    }],
                'task_title': '',
                'settings':
                    {
                        'is_direction_setting': 'RTL',
                        'is_required_setting': False,
                        'is_new_page_setting': False,
                        'is_add_picture_setting': True
                    },
                'task_type_id': '1'
            }],
            'questionnaire_id': '52'}
        result = update_questionnaire_tasks_task(data, quest["questionnaire_id"])
        assert result[0] == quest["questionnaire_id"]

        data = {'tasks': [{'answers': [{'answer_content': 'Test', 'is_correct': False, 'value': 'defalut'},
                                       {'answer_content': 'asd', 'is_correct': False, 'value': 'defalut'},
                                       {'answer_content': 'dasd', 'is_correct': False, 'value': 'defalut'}],
                           'order_key': 3, 'component_type_id': 3, 'label': 'asd', 'task_title': '',
                           'settings': {'is_direction_setting': 'RTL', 'is_required_setting': False,
                                        'is_new_page_setting': False, 'is_add_picture_setting': False},
                           'task_type_id': '1'}], 'questionnaire_id': '52'}
        result = update_questionnaire_tasks_task(data, quest["questionnaire_id"])
        assert result[0] == quest["questionnaire_id"]

        data = {'questionnaire_id': '52',
                'demographic': {'is_age_demo': True, 'is_native_demo': False, 'is_other_demo': False,
                                'is_knowledge_demo': True, 'is_daily_demo': True, 'is_writing_demo': True,
                                'is_mobile_demo': True, 'is_mouse_demo': True, 'is_design_demo': True,
                                'is_hci_demo': True, 'is_develop_demo': True}, 'is_active': True, 'direction': 'RTL'}
        result = update_questionnaire_tasks_task(data, quest["questionnaire_id"])
        assert result[0] == quest["questionnaire_id"]

        data = {'tasks': [{'answers': [{'answer_content': 'TestTest', 'is_correct': False, 'value': 'defalut'},
                                       {'answer_id': 241, 'answer_content': 'dfg', 'is_correct': False,
                                        'value': 'defalut', 'is_demographic': False}], 'order_key': 1,
                           'component_type_id': 7, 'label': 'fdg', 'images': [], 'task_title': '', 'task_id': 155,
                           'settings': {'is_direction_setting': 'RTL', 'is_required_setting': False,
                                        'is_new_page_setting': False, 'is_add_picture_setting': False},
                           'task_type_id': '1'}], 'questionnaire_id': '52'}
        result = update_questionnaire_tasks_task(data, quest["questionnaire_id"])
        assert result[0] == quest["questionnaire_id"]

        try:
            data = {'tasks': [{'answers': [{'answer_content': 'TestTest', 'is_correct': False, 'value': 'defalut'},
                                           {'answer_id': 263, 'answer_content': 'dfg', 'is_correct': False,
                                            'value': 'defalut', 'is_demographic': False}], 'order_key': 1,
                               'component_type_id': 7, 'label': 'fdg', 'images': [], 'task_title': '', 'task_id': -1,
                               'settings': {'is_direction_setting': 'RTL', 'is_required_setting': False,
                                            'is_new_page_setting': False, 'is_add_picture_setting': False},
                               'task_type_id': '1'}], 'questionnaire_id': '52'}
            result = update_questionnaire_tasks_task(data, quest["questionnaire_id"])
            assert result[0] == quest["questionnaire_id"]
        except Exception:
            assert True
    try:
        update_questionnaire_tasks_task([], -1)
    except Exception:
        assert True


@pytest.mark.django_db
def test_delete_questionnaire_tasks_task():
    data = {'tasks': [],
            'creation_date': '2021-01-06 23:25',
            'questionnaire_name': 'sad',
            'direction': 'RTL',
            'hosted_link': '',
            'is_active': True,
            'language_id': '4',
            'questionnaire_type_id': '1',
            'demographic': {
                'is_age_demo': True,
                'is_native_demo': True,
                'is_other_demo': True,
                'is_knowledge_demo': True,
                'is_daily_demo': True,
                'is_writing_demo': True,
                'is_mobile_demo': True,
                'is_mouse_demo': True,
                'is_design_demo': True,
                'is_hci_demo': True,
                'is_develop_demo': True},
            'task_type_id': '1'}
    quest_id = insert_questionnaire_tasks_task(data)

    data = {'tasks': [{'answers': [{'answer_content': 'Test', 'is_correct': False, 'value': 'defalut'},
                                   {'answer_content': 'asd', 'is_correct': False, 'value': 'defalut'},
                                   {'answer_content': 'dasd', 'is_correct': False, 'value': 'defalut'}],
                       'order_key': 3, 'component_type_id': 3, 'label': 'asd', 'task_title': '',
                       'settings': {'is_direction_setting': 'RTL', 'is_required_setting': False,
                                    'is_new_page_setting': False, 'is_add_picture_setting': False},
                       'task_type_id': '1'}], 'questionnaire_id': '52'}
    update_questionnaire_tasks_task(data, quest_id)
    part_id = ParticipantSerializer(Participant.objects.all(), many=True).data[0]['participant_id']

    serializer_1 = QuestionnaireParticipantSerializer(data={
        'questionnaire_id': quest_id,
        'participant_id': part_id,
        'test_started': datetime.datetime.now()})

    if serializer_1.is_valid():
        serializer_1.save()

    serializer_2 = ParticipantLanguageProficiencySerializer(data={'participant_id': part_id, 'language_id': 1,
                                                                  'proficiency_id': 1})
    if serializer_2.is_valid():
        serializer_2.save()

    assert delete_questionnaire_tasks_task(quest_id)['status'] == True

    try:
        delete_questionnaire_tasks_task(-1)
    except Exception:
        assert True


@pytest.mark.django_db
def test_insert_participant_data_task():
    q = Questionnaire.objects.all()
    questionnaires = QuestionnaireSerializer(q, many=True).data

    serializer = ParticipantSerializer(data={})
    if serializer.is_valid():
        serializer.save()
    p_id = serializer.data['participant_id']
    for i, quest in enumerate(questionnaires):
        data = {
            'demo_answers': {'3': {'order_key': 1, 'submitted_free_answer': '55'},
                             '4': {'order_key': 2, 'answer_id': 3},
                             '5': {'4': True, '5': True, '6': True, '7': True, '8': True, '9': False, 'order_key': 3,
                                   'submitted_free_answer': ''},
                             '6': {'1': {'10': True}, '2': {'11': True}, '3': {'10': True}, '4': {'11': True},
                                   '6': {'11': True}, 'order_key': 4},
                             '7': {'9': True, '15': True, '16': True, '17': True, '18': True, '19': True, '20': True,
                                   'order_key': 5, 'submitted_free_answer': 9}, '8': {'order_key': 6, 'answer_id': 22},
                             '9': {'order_key': 7, 'answer_id': 21}, '10': {'order_key': 8, 'answer_id': 22},
                             '11': {'order_key': 9, 'answer_id': 24}, '12': {'order_key': 10, 'answer_id': 26},
                             '13': {'9': True, '28': True, '29': True, 'order_key': 11, 'submitted_free_answer': 9}},
            'statsInfo': {'browser': 'Google Chrome', 'operating_system': 'Windows OS', 'country': 'Israel',
                          'city': 'Tel Aviv'},
            'hash': re.search(r".+/survey/(.+)", quest["hosted_link"]).group(1),
            'test_started': '2021-06-12 18:46:20'}
        assert insert_participant_data_task(p_id, data)['status'] == True
        break

    try:
        insert_participant_data_task(-1, [])
    except Exception:
        assert True


@pytest.mark.django_db
def test_get_csv_data_task():
    q = Questionnaire.objects.all()
    questionnaires = QuestionnaireSerializer(q, many=True).data
    quest_participant = QuestionnaireParticipantSerializer(QuestionnaireParticipant.objects.all(), many=True).data

    for i, quest in enumerate(questionnaires):
        for quest_participant_key in quest_participant:
            if quest['questionnaire_id'] == quest_participant_key['questionnaire_id']:
                result = get_csv_data_task(quest['questionnaire_id'])
                if result.empty:
                    continue
                assert 'participant_id' in result.columns
                assert 'Questionnaire_Language' in result.columns
                assert 'native_language_id' in result.columns
                assert 'proficiency_language' in result.columns
                assert not '_state' in result.columns


@pytest.mark.django_db
def test_insert_participant_task_data_task():
    serializer = ParticipantSerializer(data={})
    if serializer.is_valid():
        serializer.save()
    p_id = serializer.data['participant_id']

    data = {
        'demo_answers': {'3': {'order_key': 1, 'submitted_free_answer': '55'},
                         '4': {'order_key': 2, 'answer_id': 3},
                         '5': {'4': True, '5': True, '6': True, '7': True, '8': True, '9': False, 'order_key': 3,
                               'submitted_free_answer': ''},
                         '6': {'1': {'10': True}, '2': {'11': True}, '3': {'10': True}, '4': {'11': True},
                               '6': {'11': True}, 'order_key': 4},
                         '7': {'9': True, '15': True, '16': True, '17': True, '18': True, '19': True, '20': True,
                               'order_key': 5, 'submitted_free_answer': 9}, '8': {'order_key': 6, 'answer_id': 22},
                         '9': {'order_key': 7, 'answer_id': 21}, '10': {'order_key': 8, 'answer_id': 22},
                         '11': {'order_key': 9, 'answer_id': 24}, '12': {'order_key': 10, 'answer_id': 26},
                         '13': {'9': True, '28': True, '29': True, 'order_key': 11, 'submitted_free_answer': 9}},
        'statsInfo': {'browser': 'Google Chrome', 'operating_system': 'Windows OS', 'country': 'Israel',
                      'city': 'Tel Aviv'},
        'hash': 'gAAAAABgw6cT4G-tsYiJY24eMplz2dDTVZhzHOpx86paeG6yaVOLRSCnLvyEFZRLAgf7Dti2fck1ZlDxb1qPQiFgKmAopeUVLQ==',
        'test_started': '2021-06-12 18:46:20'}

    insert_participant_data_task(p_id, data)

    data = {'participant_id': p_id,
            'answers': {'177': {'comp_type': 3, 'answer_id': '258', 'task_direction': 'RTL', 'task_clicks': 1}},
            'hash': 'gAAAAABgw6cT4G-tsYiJY24eMplz2dDTVZhzHOpx86paeG6yaVOLRSCnLvyEFZRLAgf7Dti2fck1ZlDxb1qPQiFgKmAopeUVLQ==',
            'test_completed': '2021-06-12 19:52:28'}

    assert insert_participant_task_data_task(data, p_id)['status']

    try:
        insert_participant_task_data_task([], -1)
    except Exception:
        assert True

@pytest.mark.django_db
def test_delete_tasks():
    assert delete_tasks([177, 184])['status']

    try:
        delete_tasks(-1)
    except Exception:
        assert True