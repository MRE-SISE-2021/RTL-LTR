from .serializers import *
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response


# Component
class ComponentViewSet(viewsets.ModelViewSet):
    serializer_class = ComponentSerializer
    queryset = Component.objects.all()


# HciBackground
class HciBackgroundViewSet(viewsets.ModelViewSet):
    serializer_class = HciBackgroundSerializer
    queryset = HciBackground.objects.all()


# Image
class ImageViewSet(viewsets.ModelViewSet):
    serializer_class = ImageSerializer
    queryset = Image.objects.all()


# Language
class LanguageViewSet(viewsets.ModelViewSet):
    serializer_class = LanguageSerializer
    queryset = Language.objects.all()


# QuestionnaireType
class QuestionnaireTypeViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionnaireTypeSerializer
    queryset = QuestionnaireType.objects.all()


# Task
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()


# Participant
class ParticipantViewSet(viewsets.ModelViewSet):
    serializer_class = ParticipantSerializer
    queryset = Participant.objects.all()


# AnswerTask
class AnswerTaskViewSet(viewsets.ModelViewSet):
    serializer_class = AnswerTaskSerializer
    queryset = AnswerTask.objects.all()


# ParticipantLanguageProficiency
class ParticipantLanguageProficiencyViewSet(viewsets.ModelViewSet):
    serializer_class = ParticipantLanguageProficiencySerializer
    queryset = ParticipantLanguageProficiency.objects.all()


# TaskParticipant
class TaskParticipantViewSet(viewsets.ModelViewSet):
    serializer_class = TaskParticipantSerializer
    queryset = TaskParticipant.objects.all()


# Questionnaire
class QuestionnaireViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionnaireSerializer
    queryset = Questionnaire.objects.all()


# QuestionnaireParticipant
class QuestionnaireParticipantViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionnaireParticipantSerializer
    queryset = QuestionnaireParticipant.objects.all()


# QuestionnaireTask
class QuestionnaireTaskViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionnaireTaskSerializer
    queryset = QuestionnaireTask.objects.all()


# TaskComponent
class TaskComponentViewSet(viewsets.ModelViewSet):
    serializer_class = TaskComponentSerializer
    queryset = TaskComponent.objects.all()


# TaskImage
class TaskImageViewSet(viewsets.ModelViewSet):
    serializer_class = TaskImageSerializer
    queryset = TaskImage.objects.all()
