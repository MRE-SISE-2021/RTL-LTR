from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Routers

# Component
router_component_type = DefaultRouter()
router_component_type.register('component_type', ComponentTypeViewSet, basename='component_type')

# HciBackground
router_hci_background = DefaultRouter()
router_hci_background.register('hci_background', HciBackgroundViewSet, basename='hci_background')

# Image
router_image = DefaultRouter()
router_image.register('image', ImageViewSet, basename='image')

# Language
router_language = DefaultRouter()
router_language.register('language', LanguageViewSet, basename='language')

# QuestionnaireType
router_questionnaire_type = DefaultRouter()
router_questionnaire_type.register('questionnaire_type', QuestionnaireTypeViewSet, basename='questionnaire_type')

# Task
router_task = DefaultRouter()
router_task.register('task', TaskViewSet, basename='task')

# Participant
router_participant = DefaultRouter()
router_participant.register('participant', ParticipantViewSet, basename='participant')

# Participant
router_proficiency = DefaultRouter()
router_proficiency.register('proficiency', ProficiencyViewSet, basename='proficiency')

# Answer
router_answer = DefaultRouter()
router_answer.register('answer', AnswerViewSet, basename='answer')

# TaskAnswer
router_task_answer = DefaultRouter()
router_task_answer.register('task_answer', TaskAnswerViewSet, basename='task_answer')

# ParticipantLanguageProficiency
router_participant_language_proficiency = DefaultRouter()
router_participant_language_proficiency.register('participant_language_proficiency',
                                                 ParticipantLanguageProficiencyViewSet,
                                                 basename='participant_language_proficiency')

# TaskParticipant
router_task_participant = DefaultRouter()
router_task_participant.register('task_participant', TaskParticipantViewSet, basename='task_participant')

# Questionnaire
router_questionnaire = DefaultRouter()
router_questionnaire.register('questionnaire', QuestionnaireViewSet, basename='questionnaire')

# QuestionnaireParticipant
router_questionnaire_participant = DefaultRouter()
router_questionnaire_participant.register('questionnaire_participant', QuestionnaireParticipantViewSet,
                                          basename='questionnaire_participant')

# QuestionnaireTask
router_questionnaire_task = DefaultRouter()
router_questionnaire_task.register('questionnaire_task', QuestionnaireTaskViewSet, basename='questionnaire_task')

# TaskImage
router_task_image = DefaultRouter()
router_task_image.register('task_image', TaskImageViewSet, basename='task_image')


# URL dispatcher:
# https://docs.djangoproject.com/en/3.1/topics/http/urls/
urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('viewset/', include(router_component_type.urls)),
    path('viewset/', include(router_hci_background.urls)),
    path('viewset/', include(router_image.urls)),
    path('viewset/', include(router_language.urls)),
    path('viewset/', include(router_questionnaire_type.urls)),
    path('viewset/', include(router_task.urls)),
    path('viewset/', include(router_participant.urls)),
    path('viewset/', include(router_participant_language_proficiency.urls)),
    path('viewset/', include(router_task_participant.urls)),
    path('viewset/', include(router_answer.urls)),
    path('viewset/', include(router_task_answer.urls)),
    path('viewset/', include(router_questionnaire.urls)),
    path('viewset/', include(router_questionnaire_participant.urls)),
    path('viewset/', include(router_questionnaire_task.urls)),
    path('viewset/', include(router_task_image.urls)),
    path('viewset/', include(router_proficiency.urls)),



    ### DECORATORS ###
    # GET list of questionnaire names
    path('questionnaire-names/', get_questionnaire_name_list),
    # GET tasks with settings by questionnaire_id
    path('get-tasks-with-settings-from-questionnaire/<int:id>', get_tasks_with_settings_from_questionnaire),
    # DELETE task from questionnaire by id. id: questionnaire_id, task_id in JSON
    path('delete-task-from-questionnaire/<int:id>', delete_task_from_questionnaire),

    ### CLASS BASED VIEWS ###
    # QuestionnairePreviewAPIView (GET, POST, PUT, DELETE)
    path('questionnaire-preview-data', QuestionnairePreviewAPIView.as_view()),
    path('questionnaire-preview-data/<int:id>', QuestionnairePreviewAPIView.as_view()),

    # ParticipantAPIView (GET, POST, PUT, DELETE)
    path('participant-data', ParticipantAPIView.as_view()),
    path('participant-data/<int:id>', ParticipantAPIView.as_view())
]
