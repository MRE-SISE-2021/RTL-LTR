from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

#### VIEWSETS ####
router = DefaultRouter()
router.register('language', LanguageViewSet, basename='language')


# URL dispatcher:
# https://docs.djangoproject.com/en/3.1/topics/http/urls/
urlpatterns = [
    #### SIMPLE HTTP REQUESTS + DECORATOR ####
    # path('language_test', language_test),
    # path('language_detail_test/<int:pk>', language_detail_test)

    #### CLASS BASED VIEWS ####
    # path('language_test', LanguageAPIView.as_view()),
    # path('language_detail_test/<int:id>', LanguageDetailsAPIView.as_view())

    #### GENERIC VIEWS ####
    # path('generic/language_test', GenericLanguageAPIView.as_view()),
    # path('generic/language_test/<int:language_id>', GenericLanguageAPIView.as_view()),

    #### VIEWSETS ####
    path('viewset/', include(router.urls))
]
