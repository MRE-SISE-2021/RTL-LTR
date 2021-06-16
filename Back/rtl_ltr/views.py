from django.core.files.storage import FileSystemStorage
from django.db import transaction
from django.http import JsonResponse, HttpResponse
from rest_framework.permissions import IsAuthenticated
from django.core import serializers as core_serializers
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from .serializers import *
from .tasks import *


####### MODEL VIEWSETS #######
# Component
@permission_classes([IsAuthenticated])
class ComponentTypeViewSet(viewsets.ModelViewSet):
    serializer_class = ComponentTypeSerializer
    queryset = ComponentType.objects.all()


# HciBackground
@permission_classes([IsAuthenticated])
class HciBackgroundViewSet(viewsets.ModelViewSet):
    serializer_class = HciBackgroundSerializer
    queryset = HciBackground.objects.all()


# Image
@permission_classes([IsAuthenticated])
class ImageViewSet(viewsets.ModelViewSet):
    serializer_class = ImageSerializer
    queryset = Image.objects.all()


# Language
@permission_classes([IsAuthenticated])
class LanguageViewSet(viewsets.ModelViewSet):
    serializer_class = LanguageSerializer
    queryset = Language.objects.all()


# QuestionnaireType
@permission_classes([IsAuthenticated])
class QuestionnaireTypeViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionnaireTypeSerializer
    queryset = QuestionnaireType.objects.all()


# Task
@permission_classes([IsAuthenticated])
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()


# Participant
@permission_classes([IsAuthenticated])
class ParticipantViewSet(viewsets.ModelViewSet):
    serializer_class = ParticipantSerializer
    queryset = Participant.objects.all()


# Proficiency
@permission_classes([IsAuthenticated])
class ProficiencyViewSet(viewsets.ModelViewSet):
    serializer_class = ProficiencySerializer
    queryset = Proficiency.objects.all()


# Answer
class AnswerViewSet(viewsets.ModelViewSet):
    serializer_class = AnswerSerializer
    queryset = Answer.objects.all()


# TaskAnswer
@permission_classes([IsAuthenticated])
class TaskAnswerViewSet(viewsets.ModelViewSet):
    serializer_class = TaskAnswerSerializer
    queryset = TaskAnswer.objects.all()


# ParticipantLanguageProficiency
@permission_classes([IsAuthenticated])
class ParticipantLanguageProficiencyViewSet(viewsets.ModelViewSet):
    serializer_class = ParticipantLanguageProficiencySerializer
    queryset = ParticipantLanguageProficiency.objects.all()


# TaskParticipant
@permission_classes([IsAuthenticated])
class TaskParticipantViewSet(viewsets.ModelViewSet):
    serializer_class = TaskParticipantSerializer
    queryset = TaskParticipant.objects.all()


# Questionnaire
@permission_classes([IsAuthenticated])
class QuestionnaireViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionnaireSerializer
    queryset = Questionnaire.objects.all()


# QuestionnaireParticipant
@permission_classes([IsAuthenticated])
class QuestionnaireParticipantViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionnaireParticipantSerializer
    queryset = QuestionnaireParticipant.objects.all()


# QuestionnaireTask
@permission_classes([IsAuthenticated])
class QuestionnaireTaskViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionnaireTaskSerializer
    queryset = QuestionnaireTask.objects.all()


# TaskImage
@permission_classes([IsAuthenticated])
class TaskImageViewSet(viewsets.ModelViewSet):
    serializer_class = TaskImageSerializer
    queryset = TaskImage.objects.all()


####### DECORATORS GETs #######

# get list of questionnaire name for main page
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_questionnaires_table(request):
    if request.method == "GET":
        quest_data = get_questionnaires_table_task()
        return Response(quest_data, status=status.HTTP_200_OK)


# get list of questionnaire name for main page
@api_view(['GET'])
def get_questionnaire_by_hosted_link(request):
    if request.method == "GET":
        request_language_tuple = get_questionnaire_by_hosted_link_task(request)
        return QuestionnairePreviewAPIView.get(request_language_tuple[0], request_language_tuple[1])


# get list of questionnaire name for main page
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_questionnaire(request, id):
    if request.method == "GET":
        questionnaire_data = get_questionnaire_task(id)
        return Response(questionnaire_data, status=status.HTTP_200_OK)


# get list of questionnaire name for main page
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_csv_data(request, id):
    if request.method == "GET":
        csv = get_csv_data_task(id)
        csv_list = csv.values.tolist()
        csv_list.insert(0, list(csv.columns.values))
        return Response(csv_list, status=status.HTTP_200_OK)


####### DECORATORS DELETE #######
# DELETE task from questionnaire
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_task_from_questionnaire(request, id):
    delete_task_from_questionnaire_task(request.data, id)
    return Response(status=status.HTTP_204_NO_CONTENT)


####### CLASS BASED VIEWS #######


class QuestionnairePreviewAPIView(APIView):
    # get preview data for home page of a questionnaire by questionnaire_id
    @staticmethod
    @permission_classes([IsAuthenticated])
    def get(request, id):
        # get queryset of questionnaire table by questionnaire_id
        preview_data = get_preview_data_task(request.GET.get('language', ''), id)
        return Response(preview_data, status=status.HTTP_200_OK)

    # Save new questionnaire to db (with tasks, answers, images)
    @transaction.atomic
    @permission_classes([IsAuthenticated])
    def post(self, request):
        questionnaire_id = insert_questionnaire_tasks_task(request.data)
        return Response({'questionnaire_id': questionnaire_id}, status=status.HTTP_201_CREATED)

    @transaction.atomic
    def put(self, request, id):
        ids_questionnaire_tasks_tuple = update_questionnaire_tasks_task(request.data, id)
        return Response({'questionnaire_id': ids_questionnaire_tasks_tuple[0],
                         'task_id': ids_questionnaire_tasks_tuple[1]}, status=status.HTTP_200_OK)

    @transaction.atomic
    @permission_classes([IsAuthenticated])
    def delete(self, request, id):
        delete_questionnaire_tasks_task(id)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ParticipantAPIView(APIView):
    @transaction.atomic
    def post(self, request):
        participant_id = insert_data_into_table(ParticipantSerializer(data={}), 'participant_id')
        # insert_participant_data_task.apply_async((participant_id, request.data))
        insert_participant_data_task(participant_id, request.data)

        return Response({'participant_id': participant_id}, status=status.HTTP_201_CREATED)

    @transaction.atomic
    def put(self, request, id):
        # insert_participant_task_data_task.apply_async((request.data, id))
        insert_participant_task_data_task(request.data, id)
        return Response(status=status.HTTP_201_CREATED)

########################################################################################################################


# @api_view(['POST'])
# @transaction.atomic
# def demo_task_post(request):
#     """
#     Inner usage: Insert demographic questions and answers to DB
#
#     Args:
#             request: request data from the Client
#     """
#
#     # lists of key-value {task_id: data}
#     task_ids = []
#     task_answers = []
#     task_images = []
#
#     # get parameters for update
#     tasks_put = request.data
#
#     # insert or update Task table
#     # insert a new task to questionnaire and get id of the new task
#     task_id = insert_data_into_table(TaskSerializer(data=tasks_put),
#                                      'task_id')
#
#     # map the new task_id with its answers, images
#     task_ids.append(task_id)
#     task_answers.append({task_id: tasks_put.pop('answers')}) if tasks_put['answers'] else None
#     task_images.append({task_id: tasks_put.pop('images')}) if tasks_put['images'] else None
#
#     # insert or update Answer table (the same architecture as Task)
#     for task_answer in task_answers:
#         task_id = next(iter(task_answer))
#         answers = task_answer[task_id]
#
#         for answer in answers:
#             if 'answer_id' in answer:
#                 answer_id = answer['answer_id']
#             else:
#                 serializer = AnswerSerializer(data=answer)
#                 answer_id = insert_data_into_table(serializer, 'answer_id')
#
#             serializer = TaskAnswerSerializer(data={'task_id': task_id,
#                                                     'answer_id': answer_id})
#             if serializer.is_valid():
#                 serializer.save()
#
#     return Response({'task_id': task_ids}, status=status.HTTP_200_OK)
