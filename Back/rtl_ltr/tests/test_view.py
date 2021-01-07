from django.test import TestCase
from rest_framework.test import RequestsClient
from django.test import Client
from rtl_ltr.views import *

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Back.settings")


# Create your tests here.

class ViewTests(TestCase):
    def setUp(self):
        host = 'http://127.0.0.1:8000/'

    def test_component_get(self):
        client = Client()
        response = client.get('/viewset/component/')
        assert response.status_code == 200