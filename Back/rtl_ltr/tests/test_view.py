import pdb

from django.test import TestCase
from requests import HTTPError
from rest_framework.test import RequestsClient
from django.test import Client

from Back import settings
from rtl_ltr.views import *
import pytest
from django.test.client import RequestFactory
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Back.settings")


# Create your tests here.

class ViewTests(TestCase):

    ##### GET TESTS #####
    def test_component_get(self):
        client = Client()
        response = client.get('/viewset/component_type/')
        assert response.status_code == 200

    def test_hci_background_get(self):
        client = Client()
        response = client.get('/viewset/hci_background/')
        assert response.status_code == 200

    def test_image_get(self):
        client = Client()
        response = client.get('/viewset/image/')
        assert response.status_code == 200

    def test_language_get(self):
        client = Client()
        response = client.get('/viewset/language/')
        assert response.status_code == 200

    def test_cquestionnaire_type_get(self):
        client = Client()
        response = client.get('/viewset/questionnaire_type/')
        assert response.status_code == 200

    def test_task_get(self):
        client = Client()
        response = client.get('/viewset/task/')
        assert response.status_code == 200

    def test_participant_get(self):
        client = Client()
        response = client.get('/viewset/participant/')
        assert response.status_code == 200

    def test_answer_task_get(self):
        client = Client()
        response = client.get('/viewset/task_answer/')
        assert response.status_code == 200

    def test_participant_language_proficiency_get(self):
        client = Client()
        response = client.get('/viewset/participant_language_proficiency/')
        assert response.status_code == 200

    def test_task_participant_get(self):
        client = Client()
        response = client.get('/viewset/task_participant/')
        assert response.status_code == 200

    def test_questionnaire_get(self):
        client = Client()
        response = client.get('/viewset/questionnaire/')
        assert response.status_code == 200

    def test_questionnaire_participant_get(self):
        client = Client()
        response = client.get('/viewset/questionnaire_participant/')
        assert response.status_code == 200

    def test_questionnaire_task_get(self):
        client = Client()
        response = client.get('/viewset/questionnaire_task/')
        assert response.status_code == 200

    def test_task_component_get(self):
        client = Client()
        response = client.get('/viewset/component_type/')
        assert response.status_code == 200

    def test_task_image_get(self):
        client = Client()
        response = client.get('/viewset/task_image/')
        assert response.status_code == 200

    ##### POST TESTS #####
    @pytest.mark.order(2)
    def test_hci_background_post(self):
        client = Client()
        response = client.post('/viewset/hci_background/', {"hci_background_description": "Test description"})
        assert response.status_code == 201

    @pytest.mark.order(3)
    def test_image_post(self):
        client = Client()
        response = client.post('/viewset/image/', {"image_url": "Test URL"})
        assert response.status_code == 201

    @pytest.mark.order(4)
    def test_language_post(self):
        client = Client()
        response = client.post('/viewset/language/', {"language_name": "Test lang", "language_direction": "RTL"})
        assert response.status_code == 201

    @pytest.mark.order(5)
    def test_cquestionnaire_type_post(self):
        client = Client()
        response = client.post('/viewset/questionnaire_type/', {"questionnaire_type_name": "Test name"})
        assert response.status_code == 201

    @pytest.mark.order(7)
    def test_participant_post(self):
        client = Client()
        response = client.post('/viewset/participant/', {})
        assert response.status_code == 201

    @pytest.mark.order(8)
    def test_answer_task_post(self):
        client = Client()
        client.post('/viewset/language/', {"language_name": "Arabic",
                                           "language_direction": "RTL"})
        client.post('/viewset/component_type/', {"component_type": "Pages"})
        client.post('/viewset/task/', {"task_title": "Test title", "task_content": "Test content",
                                       "is_required": True, "language_id": 1,
                                       "order_key": 1, "is_direction_setting": True,
                                       "component_type_id": 1})
        client.post('/viewset/answer/', {"answer_content": "Amharic",
                                         "is_correct": False,
                                         "value": "5",
                                         "is_demographic": True})
        response = client.post('/viewset/task_answer/', {"answer_id": 1, "task_id": 1})
        assert response.status_code == 201

    @pytest.mark.order(9)
    def test_get_questionnaires_table(self):
        rf = RequestFactory()
        get_request = rf.get('https://test.com/')
        response = get_questionnaires_table(get_request)
        assert response.status_code == 200
