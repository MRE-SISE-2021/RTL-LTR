from django.test import TestCase
from requests import HTTPError
from rest_framework.test import RequestsClient
from django.test import Client
from rtl_ltr.views import *
import pytest

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
        response = client.get('/viewset/answer_task/')
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
        response = client.get('/viewset/task_component/')
        assert response.status_code == 200

    def test_task_image_get(self):
        client = Client()
        response = client.get('/viewset/task_image/')
        assert response.status_code == 200

    def test_task_questionnaire_names_get(self):
        client = Client()
        response = client.get('/questionnaire-names/')
        assert response.status_code == 200

    ##### POST TESTS #####
    @pytest.mark.order(1)
    def test_component_post(self):
        client = Client()
        response = client.post('/viewset/component/', {"component_type": "Test"})
        assert response.status_code == 201

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

    @pytest.mark.order(6)
    def test_task_post(self):
        client = Client()
        response = client.post('/viewset/task/', {"task_title": "Test title", "task_content": "Test content",
                                                  "is_required": True, "language_id": 1})
        assert response.status_code == 201


    @pytest.mark.order(7)
    def test_participant_post(self):
        client = Client()
        response = client.post('/viewset/participant/', {"sex": "Male", "age": 28, "ltr_proficiency": 1,
                                                         "rtl_proficiency": 1, "dominant_hand_writing": "Right",
                                                         "dominant_hand_mobile": "Right", "dominant_hand_web": "Right",
                                                         "dominant_hand_mode": 2, "is_rtl_speakers": False,
                                                         "is_rtl_interface": False, "is_rtl_paper_documents": False,
                                                         "is_ltr_speakers": False, "is_ltr_interface": False,
                                                         "is_ltr_paper_documents": False,
                                                         "is_rtl_and_ltr_interface": False,
                                                         "other_prof_experience": "Test", "hci_experience": False,
                                                         "is_rtl_interfaces_experience": False,
                                                         "is_ltr_interfaces_experience": False,
                                                         "other_language_working_characteristics": "Test",
                                                         "questionnaire_version": "Test", "country": "Test",
                                                         "operating_system": "Test", "browser_type": "Test",
                                                         "mother_tongue": 1, "hci_background_id": 1})
        assert response.status_code == 201

    @pytest.mark.order(8)
    def test_answer_task_post(self):
        client = Client()
        response = client.post('/viewset/answer_task/', {"answer_content": "Test", "is_correct": False, "task_id": 1})
        assert response.status_code == 201

    @pytest.mark.order(9)
    def test_participant_language_proficiency_post(self):
        client = Client()
        response = client.post('/viewset/participant_language_proficiency/', {"proficiency": "Test",
                                                                              "participant_id": 1,
                                                                              "language_id": 1})
        assert response.status_code == 201

    @pytest.mark.order(10)
    def test_task_participant_post(self):
        client = Client()
        response = client.post('/viewset/task_participant/', {"task_direction": "RTL", "task_time": "11:40",
                                                              "task_clicks": 1, "task_errors": 1,
                                                              "submitted_free_answer": "Test", "participant_id": 1,
                                                              "task_id": 1, "answer_id": 1})
        assert response.status_code == 201

    @pytest.mark.order(11)
    def test_questionnaire_post(self):
        client = Client()
        response = client.post('/viewset/questionnaire/', {"creation_date": "06/01/2021 11:44",
                                                           "questionnaire_name": "Test", "hosted_link": "Test Link",
                                                           "is_active": False, "language_id": 1,
                                                           "questionnaire_type_id": 1})
        assert response.status_code == 201

    @pytest.mark.order(12)
    def test_questionnaire_participant_post(self):
        client = Client()
        response = client.post('/viewset/questionnaire_participant/', {"questionnaire_start": '11:00',
                                                                       "questionnaire_finish": "11:30",
                                                                       "time_spent": "00:30",
                                                                       "satisfaction": "Test",
                                                                       "questionnaire_id": 1,
                                                                       "participant_id": 1})
        assert response.status_code == 201

    @pytest.mark.order(13)
    def test_questionnaire_task_post(self):
        client = Client()
        response = client.post('/viewset/questionnaire_task/', {"questionnaire_id": 1, "task_id": 1})
        assert response.status_code == 201

    @pytest.mark.order(14)
    def test_task_component_post(self):
        client = Client()
        response = client.post('/viewset/task_component/', {"direction": "RTL", "task_id": 1, "component_id": 1})
        assert response.status_code == 201

    @pytest.mark.order(15)
    def test_task_task_image_post(self):
        client = Client()
        response = client.post('/viewset/task_image/', {"task_id": 1, "image_id": 1})
        assert response.status_code == 201
