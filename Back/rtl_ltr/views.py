from django.core.handlers import exception

from .serializers import *
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.http import HttpResponse
from django.db import transaction


####### MODEL VIEWSETS #######
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


# Answer
class AnswerViewSet(viewsets.ModelViewSet):
    serializer_class = AnswerSerializer
    queryset = Answer.objects.all()


# TaskAnswer
class TaskAnswerViewSet(viewsets.ModelViewSet):
    serializer_class = TaskAnswerSerializer
    queryset = TaskAnswer.objects.all()


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


####### DECORATORS #######

# get list of questionnaire name for main page
@api_view(['GET'])
def get_questionnaire_name_list(request):
    if request.method == "GET":
        queryset = Questionnaire.objects.all()
        data = QuestionnaireSerializer(queryset, many=True).data

        names_list = []
        for value in data:
            names_list.append(value['questionnaire_name'])

        return Response(names_list, status=status.HTTP_200_OK)


# get preview data of a questionnaire by questionnaire_id
@api_view(['GET'])
def get_questionnaire_data_by_id(request, pk):
    if request.method == "GET":
        queryset = Questionnaire.objects.get(pk=pk)

        data = QuestionnaireSerializer(queryset, many=False, fields=('questionnaire_id', 'creation_date',
                                                                     'questionnaire_name', 'hosted_link',
                                                                     'is_active', 'language_id',
                                                                     'questionnaire_type_id')).data

        return Response(data, status=status.HTTP_200_OK)


@transaction.atomic
@api_view(['POST'])
def create_questionnaire_to_db(request):
    if request.method == 'POST':
        data = request.data

        tasks = data[0].pop('tasks')
        questionnaire_table_data = data[0]

        # Create new Questionnaire in db table Questionnaire
        questionnaire_serializer = QuestionnaireSerializer(data=questionnaire_table_data)
        if questionnaire_serializer.is_valid():
            questionnaire_serializer.save()
        else:
            raise Exception("Create Questionnaire Error: Questionnaire Serializer is not valid")
        # Save id of new created questionnaire
        questionnaire_id = questionnaire_serializer.data['questionnaire_id']

        # Create new Task in db table Task
        # Create connection QuestionnaireTask in db table QuestionnaireTask
        for task in tasks:
            # Check the task not exists in db
            task_id = -1
            answers = {}
            components = {}
            images = {}

            if 'task_id' not in task:
                answers = task.pop('answers')
                components = task.pop('components')
                images = task.pop('images')

                task_serializer = TaskSerializer(data=task)
                if task_serializer.is_valid():
                    task_serializer.save()
                else:
                    raise Exception("Create Questionnaire Error: Task Serializer is not valid")

                # Save id of new created task
                task_id = task_serializer.data['task_id']
            else:
                task_id = task['task_id']

            # Create connection task-questionnaire
            questionnaire_task_serializer = QuestionnaireTaskSerializer(data={'questionnaire_id': questionnaire_id,
                                                                              'task_id': task_id})
            if questionnaire_task_serializer.is_valid():
                questionnaire_task_serializer.save()
            else:
                raise Exception("Create Questionnaire Error: QuestionnaireTask Serializer is not valid")

            # Create answer in db table Answer
            # Create connection TaskAnswer in db table TaskAnswer
            for answer in answers:
                answer_id = -1
                if 'answer_id' not in answer:
                    answer_serializer = AnswerSerializer(data=answer)
                    if answer_serializer.is_valid():
                        answer_serializer.save()
                    else:
                        raise Exception("Create Questionnaire Error: Answer Serializer is not valid")
                    # save id of new created answer
                    answer_id = answer_serializer.data['answer_id']
                else:
                    answer_id = answer['answer_id']

                # Add connection between task-answer
                task_answer_serializer = TaskAnswerSerializer(
                    data={'answer_id': answer_id,
                          'task_id': task_id})
                if task_answer_serializer.is_valid():
                    task_answer_serializer.save()
                else:
                    raise Exception("Create Questionnaire Error: TaskAnswer Serializer is not valid")

            # Create component in db table Component
            # Create connection TaskAnswer in db table TaskComponent
            for component in components:
                component_id = -1
                if 'component_id' not in component:
                    component_serializer = ComponentSerializer(data=component)
                    if component_serializer.is_valid():
                        component_serializer.save()
                    else:
                        raise Exception("Create Questionnaire Error: Component Serializer is not valid")
                    # save id of new created component
                    component_id = component_serializer.data['component_id']
                else:
                    component_id = component['component_id']

                # Add connection between task-component
                task_component_serializer = TaskComponentSerializer(
                    data={'component_id': component_id,
                          'task_id': task_id,
                          'direction': component["direction"]})
                if task_component_serializer.is_valid():
                    task_component_serializer.save()
                else:
                    raise Exception("Create Questionnaire Error: TaskComponent Serializer is not valid")

            # Create image in db table Image
            # Create connection TaskImage in db table TaskImage
            for image in images:
                image_id = -1
                if 'image_id' not in image:
                    image_serializer = ImageSerializer(data=image)
                    if image_serializer.is_valid():
                        image_serializer.save()
                    else:
                        raise Exception("Create Questionnaire Error: Image Serializer is not valid")
                    # save id of new created component
                    image_id = image_serializer.data['image_id']
                else:
                    image_id = image['image_id']

                # Add connection between task-component
                task_image_serializer = TaskImageSerializer(
                    data={'image_id': image_id,
                          'task_id': task_id})
                if task_image_serializer.is_valid():
                    task_image_serializer.save()
                else:
                    raise Exception("Create Questionnaire Error: TaskImage Serializer is not valid")

        return Response(data, status=status.HTTP_201_CREATED)
