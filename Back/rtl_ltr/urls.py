from django.urls import path
from .views import *

urlpatterns = [
    path('language_test', language_test),
    path('language_detail_test/<int:pk>', language_detail_test)
]
