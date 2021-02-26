from django.core.handlers import exception

from .serializers import *
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
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


####### CLASS BASED VIEWS #######

class QuestionnairePreviewAPIView(APIView):
    def get_object(self, id):
        try:
            return Questionnaire.objects.get(questionnaire_id=id)
        except Questionnaire.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)

    # get preview data for home page of a questionnaire by questionnaire_id
    def get(self, request, id):
        queryset = self.get_object(id)
        data = QuestionnaireSerializer(queryset, many=False, fields=('questionnaire_id', 'creation_date',
                                                                     'questionnaire_name', 'hosted_link',
                                                                     'is_active', 'language_id',
                                                                     'questionnaire_type_id')).data

        return Response(data, status=status.HTTP_200_OK)

    # Save new questionnaire to db (with tasks, answers, components, images)
    @transaction.atomic
    def post(self, request):
        # lists of key-value {task_id: data}
        task_answers = []
        task_components = []
        task_images = []

        tasks = request.data.pop('tasks')
        questionnaire_table_data = request.data

        # create a new questionnaire in the table and get its id
        questionnaire_id = insert_data_into_table(QuestionnaireSerializer(data=questionnaire_table_data),
                                                  'questionnaire_id')

        # create tasks and associate them with the new questionnaire
        # if task exists in db, only associate it
        for task in tasks:
            # associate existing task with the new questionnaire
            if 'task_id' in task:
                insert_data_into_table(QuestionnaireTaskSerializer(data={'questionnaire_id': questionnaire_id,
                                                                         'task_id': task['task_id']}))
                continue

            # get id of a new task
            task_id = insert_data_into_table(TaskSerializer(data=task),
                                             'task_id')

            # associate the new task with the new questionnaire
            insert_data_into_table(QuestionnaireTaskSerializer(data={'questionnaire_id': questionnaire_id,
                                                                     'task_id': task_id}))

            # map the new task_id with its answers, components, images
            task_answers.append({task_id: task.pop('answers')}) if task['answers'] else None
            task_components.append({task_id: task.pop('components')}) if task['components'] else None
            task_images.append({task_id: task.pop('images')}) if task['images'] else None

        # create answers and associate them with the new tasks
        # if answer exists in db, only associate it
        for task_answer in task_answers:
            # associate existing component with the new task
            task_id = next(iter(task_answer))
            answer = task_answer[task_id]

            insert_associate_task_data(association_task_id=task_id,
                                       data_list=answer,
                                       data_id_name='answer_id',
                                       serializer=AnswerSerializer,
                                       association_task_serializer=TaskAnswerSerializer)

        # create components and associate them with the new tasks
        for task_component in task_components:
            # associate existing component with the new task
            task_id = next(iter(task_component))
            component = task_component[task_id]

            insert_associate_task_data(association_task_id=task_id,
                                       data_list=component,
                                       data_id_name='component_id',
                                       serializer=ComponentSerializer,
                                       association_task_serializer=TaskComponentSerializer)

        # create images and associate them with the new tasks
        # if image exists in db, only associate it
        for task_image in task_images:
            # associate existing image with the new task
            task_id = next(iter(task_image))
            image = task_image[task_id]

            insert_associate_task_data(association_task_id=task_id,
                                       data_list=image,
                                       data_id_name='image_id',
                                       serializer=ImageSerializer,
                                       association_task_serializer=TaskImageSerializer)

        return Response(request.data, status=status.HTTP_201_CREATED)

    @transaction.atomic
    def put(self, request, id):
        pass


####### INSTRUMENTAL FUNCTIONS #######

# POST QuestionnairePreviewAPIView
# insert answer, component and image to db and associate them with a task
def insert_associate_task_data(association_task_id, data_list, data_id_name, serializer, association_task_serializer):
    # data exists in db
    for data in data_list:
        if data_id_name in data:
            insert_data_into_table(association_task_serializer(data={data_id_name: data[data_id_name],
                                                                     'task_id': association_task_id}))
            continue

        # create data to db
        datum_id = insert_data_into_table(serializer(data=data),
                                          data_id_name)

        # associate the new data with the new task
        insert_data_into_table(association_task_serializer(data={data_id_name: datum_id,
                                                                 'task_id': association_task_id}))


# POST QuestionnairePreviewAPIView
# get serializer of a table and name of id field (to return the id of a new entity)
def insert_data_into_table(serializer, id_name=None):
    if serializer.is_valid():
        serializer.save()
    else:
        raise Exception(serializer.errors)

    # return id of new created entity if need
    return serializer.data[id_name] if id_name is not None else -1
