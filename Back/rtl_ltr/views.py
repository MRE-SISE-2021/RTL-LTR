from django.core.handlers import exception

from .serializers import *
from rest_framework import viewsets

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from django.http import HttpResponse
from django.db import transaction
import numpy as np


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
@permission_classes([IsAuthenticated])
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


####### DECORATORS #######

# get list of questionnaire name for main page
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_questionnaire_name_list(request):
    if request.method == "GET":
        queryset = Questionnaire.objects.all()
        data = QuestionnaireSerializer(queryset, many=True).data

        names_list = []
        for value in data:
            names_list.append(value['questionnaire_name'])

        return Response(names_list, status=status.HTTP_200_OK)


# get list of questionnaire name for main page
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tasks_with_settings_from_questionnaire(request, id):
    if request.method == "GET":
        queryset = Questionnaire.objects.get(questionnaire_id=id)
        questionnaire_data = QuestionnaireSerializer(queryset).data

        tasks_data = questionnaire_data["tasks"]
        for task in tasks_data:
            task['settings'] = {}

            for key, value in list(task.items()):
                if "_setting" in key:
                    task['settings'][key] = task.pop(key)

        return Response(tasks_data, status=status.HTTP_200_OK)


# get list of questionnaire name for main page
# @api_view(['POST'])
# def refresh_cookies(request, ):
#     if request.method == "POST":
#         x = request
#         c = 0
#         return Response(status=status.HTTP_200_OK)


# DELETE task from questionnaire
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_task_from_questionnaire(request, id):
    # check if the questionnaire was already participated
    if QuestionnaireParticipant.objects.filter(questionnaire_id=id).exists():
        return HttpResponse('Not permitted to delete: the questionnaire already was participated',
                            status=status.HTTP_208_ALREADY_REPORTED)

    # validate request
    if 'task_id' not in request.data:
        return HttpResponse('No task_id field in JSON', status=status.HTTP_400_BAD_REQUEST)

    # get parameters for update
    task_ids = []

    # get queryset of questionnaire_task table by task_id
    qt = QuestionnaireTask.objects.get(task_id=request.data['task_id'],
                                       questionnaire_id=id)
    task_ids.append(qt.task_id_id)
    qt.delete()

    delete_tasks(task_ids)

    return HttpResponse(status=status.HTTP_204_NO_CONTENT)


####### CLASS BASED VIEWS #######

@permission_classes([IsAuthenticated])
class QuestionnairePreviewAPIView(APIView):
    # get preview data for home page of a questionnaire by questionnaire_id
    def get(self, request, id):
        # get queryset of questionnaire table by questionnaire_id
        try:
            questionnaire_queryset = Questionnaire.objects.get(questionnaire_id=id)
        except Questionnaire.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)

        data = QuestionnaireSerializer(questionnaire_queryset, many=False).data
        # get demographic tasks by task_type_id
        try:
            demographic_task_queryset = Task.objects.filter(language_id=request.GET.get('language', ''))
        except Questionnaire.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)

        data['demographic_task'] = TaskSerializer(demographic_task_queryset, many=True).data

        return Response(data, status=status.HTTP_200_OK)

    # Save new questionnaire to db (with tasks, answers, images)
    @transaction.atomic
    def post(self, request):
        # lists of key-value {task_id: data}
        task_answers = []
        task_images = []

        tasks = request.data.pop('tasks')
        questionnaire_table_data = request.data

        # get settings
        if tasks is not None:
            for task in tasks:
                for key in task['settings']:
                    task[key] = task['settings'][key]

        # get demographic
        if 'demographic' in questionnaire_table_data:
            for key in questionnaire_table_data['demographic']:
                questionnaire_table_data[key] = questionnaire_table_data['demographic'][key]

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

            # map the new task_id with its answers, images
            task_answers.append({task_id: task.pop('answers')}) if task['answers'] else None
            task_images.append({task_id: task.pop('images')}) if task['images'] else None

        # create answers and associate them with the new tasks
        # if answer exists in db, only associate it
        for task_answer in task_answers:
            # associate existing answer with the new task
            task_id = next(iter(task_answer))
            answer = task_answer[task_id]

            insert_associate_task_data(association_task_id=task_id,
                                       data_list=answer,
                                       data_id_name='answer_id',
                                       serializer=AnswerSerializer,
                                       association_task_serializer=TaskAnswerSerializer)

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

        return Response({'questionnaire_id': questionnaire_id}, status=status.HTTP_201_CREATED)

    @transaction.atomic
    def put(self, request, id):
        # check if the questionnaire was already participated
        if QuestionnaireParticipant.objects.filter(questionnaire_id=id).exists():
            return HttpResponse('Not permitted to update: the questionnaire already was participated',
                                status=status.HTTP_208_ALREADY_REPORTED)

        # lists of key-value {task_id: data}
        task_ids = []
        task_answers = []
        task_images = []

        # get parameters for update
        questionnaire_put = request.data
        tasks_put = questionnaire_put.pop('tasks') if 'tasks' in questionnaire_put else {}

        # get settings
        if tasks_put:
            for task in tasks_put:
                for key in task['settings']:
                    task[key] = task['settings'][key]

        # get demographic
        if 'demographic' in questionnaire_put:
            for key in questionnaire_put['demographic']:
                questionnaire_put[key] = questionnaire_put['demographic'][key]

        # get queryset of questionnaire table by questionnaire_id
        try:
            questionnaire_queryset = Questionnaire.objects.get(questionnaire_id=id)
        except Questionnaire.DoesNotExist:
            raise Exception(Questionnaire.DoesNotExist)

        # update Questionnaire table
        update_data_into_table(QuestionnaireSerializer(questionnaire_queryset, data=questionnaire_put,
                                                       partial=True))

        # insert or update Task table
        for task in tasks_put:

            # update Task table by task_id
            if 'task_id' in task:
                task_ids.append(task['task_id'])
                task_answers.append({task['task_id']: task.pop('answers')}) if task['answers'] else None
                task_images.append({task['task_id']: task.pop('images')}) if task['images'] else None

                try:
                    task_queryset = Task.objects.get(task_id=task['task_id'])
                except Questionnaire.DoesNotExist:
                    raise Exception(Questionnaire.DoesNotExist)

                update_data_into_table(TaskSerializer(task_queryset, data=task,
                                                      partial=True))
                continue

            # insert a new task to questionnaire and get id of the new task
            task_id = insert_data_into_table(TaskSerializer(data=task),
                                             'task_id')

            # map the new task_id with its answers, images
            task_ids.append(task_id)
            task_answers.append({task_id: task.pop('answers')}) if task['answers'] else None
            task_images.append({task_id: task.pop('images')}) if task['images'] else None

            # associate the new task with the new questionnaire
            insert_data_into_table(QuestionnaireTaskSerializer(data={'questionnaire_id': id,
                                                                     'task_id': task_id}))
        # insert or update Answer table (the same architecture as Task)
        for task_answer in task_answers:
            task_id = next(iter(task_answer))
            answer = task_answer[task_id]

            update_associate_task_data(association_task_id=task_id,
                                       data_list=answer,
                                       data_id_name='answer_id',
                                       serializer=AnswerSerializer,
                                       association_task_serializer=TaskAnswerSerializer,
                                       model_name='Answer')

        # insert or update Image table (the same architecture as Task)
        for task_image in task_images:
            task_id = next(iter(task_image))
            image = task_image[task_id]

            update_associate_task_data(association_task_id=task_id,
                                       data_list=image,
                                       data_id_name='image_id',
                                       serializer=ImageSerializer,
                                       association_task_serializer=TaskImageSerializer,
                                       model_name='Image')

        return Response({'questionnaire_id': id, 'task_id': task_ids}, status=status.HTTP_200_OK)

    @transaction.atomic
    def delete(self, request, id):
        # lists of key-value {task_id: data}
        task_ids = []

        # check if the questionnaire was already participated
        if QuestionnaireParticipant.objects.filter(questionnaire_id=id).exists():
            return HttpResponse('Not permitted to delete: the questionnaire already was participated',
                                status=status.HTTP_208_ALREADY_REPORTED)

        # get queryset of questionnaire_task table by questionnaire_id
        for qt in QuestionnaireTask.objects.filter(questionnaire_id=id):
            task_ids.append(qt.task_id_id)
            qt.delete()

        # get queryset of questionnaire table by questionnaire_id
        try:
            questionnaire_queryset = Questionnaire.objects.get(questionnaire_id=id)
        except Questionnaire.DoesNotExist:
            raise Exception(Questionnaire.DoesNotExist)

        # delete questionnaire by id from db Questionnaire table
        questionnaire_queryset.delete()

        delete_tasks(task_ids)

        return Response(status=status.HTTP_204_NO_CONTENT)


class ParticipantAPIView(APIView):
    rtl_languages_list = ['Aramaic', 'Azeri', 'Dhivehi', 'Maldivian', 'Kurdish', 'Sorani', 'Persian', 'Farsi', 'Urdu']

    # get preview data for home page of a questionnaire by questionnaire_id
    # def get(self, request, id):

    # Save new questionnaire to db (with tasks, answers, images)
    @transaction.atomic
    def post(self, request):
        participant_fields_dict = {}

        rtl_counter = 0
        ltr_counter = 0

        rtl_proficiency_sum = 0
        ltr_proficiency_sum = 0

        language_id_proficiency_dict = {}

        demo_answers = request.data['demo_answers']
        answer_ids_by_order = {}  # key = order_key, value = answer_id
        free_answers_by_order = {}  # key = order_key, value = answer_id

        questionnaire_data = QuestionnaireSerializer(
            Questionnaire.objects.get(questionnaire_id=request.data['questionnaire_id'])).data

        language_id = participant_fields_dict['questionnaire_language'] = questionnaire_data['language_id']
        participant_fields_dict['questionnaire_direction'] = questionnaire_data['direction']

        for demo_answer in demo_answers:
            # save answers_id and free_answer for inserting to TaskParticipant
            answer_ids_by_order[demo_answer['order_key']] = demo_answer['answer_ids'] \
                if len(demo_answer['answer_ids']) > 0 else [None]
            free_answers_by_order[demo_answer['order_key']] = demo_answer['free_answer'] if 'free_answer' \
                                                                                            in demo_answer else None

            if demo_answer['order_key'] == 1:  # How old are you?
                participant_fields_dict['age'] = int(demo_answer['free_answer'])

            elif demo_answer['order_key'] == 2:  # Your native language (select the correct answer):
                answer = AnswerSerializer(Answer.objects.get(answer_id=demo_answer['answer_ids'][0])).data
                participant_fields_dict['native_language'] = int(answer['value'])
                language_id_proficiency_dict[answer['value']] = ProficiencySerializer(
                    Proficiency.objects.get(proficiency_description='Native language')).data['proficiency_id']

            # TODO: to finish this
            elif demo_answer['order_key'] == 3:  # "What other languages do you know (you can choose several options)?"
                for id in demo_answer['answer_ids']:
                    language_id_proficiency_dict[AnswerSerializer(Answer.objects.get(answer_id=id)).data['value']] = ''

            elif demo_answer['order_key'] == 4:  # <Language> knowledge:
                pass

            elif demo_answer['order_key'] == 5:  # What characterizes your core daily work (several options)?
                # If the question is not chosen by researcher save null to the table, if chosen: save True/False
                # Here the question chosen so need to fill the options with False and change it to True if submitted
                participant_fields_dict['is_rtl_speakers'] = False
                participant_fields_dict['is_rtl_interface'] = False
                participant_fields_dict['is_rtl_paper_documents'] = False
                participant_fields_dict['is_ltr_speakers'] = False
                participant_fields_dict['is_ltr_interface'] = False
                participant_fields_dict['is_ltr_paper_documents'] = False
                for id in demo_answer['answer_ids']:
                    answer = AnswerSerializer(Answer.objects.get(answer_id=id)).data
                    if answer['value'] == '1':
                        participant_fields_dict['is_rtl_speakers'] = True
                    elif answer['value'] == '2':
                        participant_fields_dict['is_ltr_speakers'] = True
                    elif answer['value'] == '3':
                        participant_fields_dict['is_rtl_interface'] = True
                    elif answer['value'] == '4':
                        participant_fields_dict['is_ltr_interface'] = True
                    elif answer['value'] == '5':
                        participant_fields_dict['is_rtl_paper_documents'] = True
                    elif answer['value'] == '6':
                        participant_fields_dict['is_ltr_paper_documents'] = True

            elif demo_answer['order_key'] == 6:  # Which hand do you prefer to use when writing?
                answer = AnswerSerializer(Answer.objects.get(answer_id=demo_answer['answer_ids'][0])).data
                participant_fields_dict['dominant_hand_writing'] = answer['answer_content']

            elif demo_answer['order_key'] == 7:  # Which hand do you prefer to use when scrolling on the mobile phone?
                answer = AnswerSerializer(Answer.objects.get(answer_id=demo_answer['answer_ids'][0])).data
                participant_fields_dict['dominant_hand_mobile'] = answer['answer_content']

            elif demo_answer['order_key'] == 8:  # Which hand do you prefer to use when holding a computer mouse?
                answer = AnswerSerializer(Answer.objects.get(answer_id=demo_answer['answer_ids'][0])).data
                participant_fields_dict['dominant_hand_mouse'] = answer['answer_content']

            elif demo_answer['order_key'] == 9:  # Do you have professional experience in UX, UI design or development?
                answer = AnswerSerializer(Answer.objects.get(answer_id=demo_answer['answer_ids'][0])).data
                participant_fields_dict['is_hci_experience'] = int(answer['value'])

            elif demo_answer['order_key'] == 10:  # Your professional HCI experience is mainly in:
                answer = AnswerSerializer(Answer.objects.get(answer_id=demo_answer['answer_ids'][0])).data
                participant_fields_dict['hci_background_id'] = int(answer['value'])

            elif demo_answer['order_key'] == 11:  # In what languages were the interfaces that you developed?
                # If the question is not chosen by researcher save null to the table, if chosen: save True/False
                # Here the question chosen so need to fill the options with False and change it to True if submitted
                participant_fields_dict['is_rtl_interfaces_experience'] = False
                participant_fields_dict['is_ltr_interfaces_experience'] = False
                for id in demo_answer['answer_ids']:
                    answer_value = AnswerSerializer(Answer.objects.get(answer_id=id)).data['value']
                    if answer_value == '1':
                        participant_fields_dict['is_rtl_interfaces_experience'] = True
                    if answer_value == '2':
                        participant_fields_dict['is_ltr_interfaces_experience'] = True

        # language_proficiency = request.data.pop('language_proficiency')
        #
        # # from string to dict
        # language_proficiency = ast.literal_eval(language_proficiency)
        #
        # for language_name_key in language_proficiency:
        #     if Language.objects.filter(language_name=language_name_key).exists():
        #         language_data = LanguageSerializer(Language.objects.get(language_name=language_name_key)).data
        #
        #         language_id = language_data['language_id']
        #         language_direction = language_data['language_direction']
        #     else:
        #         language_direction = 'RTL' if language_name_key in self.rtl_languages_list else 'LTR'
        #
        #         # check alternative names of some languages
        #         language_name_key = 'Persian' if language_name_key == 'Farsi' else language_name_key
        #         language_name_key = 'Kurdish' if language_name_key == 'Sorani' else language_name_key
        #         language_name_key = 'Maldivian' if language_name_key == 'Dhivehi' else language_name_key
        #
        #         language_serializer = LanguageSerializer(data={'language_name': language_name_key,
        #                                                        'language_direction': language_direction})
        #
        #         language_id = insert_data_into_table(language_serializer, 'language_id')
        #
        #     # rtl and ltr proficiency
        #     if language_direction == 'RTL':
        #         rtl_counter += 1
        #         rtl_proficiency_sum += language_proficiency[language_name_key]
        #     elif language_direction == 'LTR':
        #         ltr_counter += 1
        #         ltr_proficiency_sum += language_proficiency[language_name_key]
        #
        #     language_id_proficiency_dict[language_id] = language_proficiency[language_name_key]
        #
        # participant_fields_dict['rtl_proficiency'] = rtl_proficiency_sum / rtl_counter if rtl_counter > 0 else 0
        # participant_fields_dict['ltr_proficiency'] = ltr_proficiency_sum / ltr_counter if ltr_counter > 0 else 0

        # Calculate dominant_hand_mode
        dominant_hand_list = []
        if 'dominant_hand_writing' in participant_fields_dict:
            dominant_hand_list.append(participant_fields_dict['dominant_hand_writing'])
        if 'dominant_hand_mobile' in participant_fields_dict:
            dominant_hand_list.append(participant_fields_dict['dominant_hand_mobile'])
        if 'dominant_hand_mouse' in participant_fields_dict:
            dominant_hand_list.append(participant_fields_dict['dominant_hand_mouse'])

        if len(dominant_hand_list) > 0:
            dominant_hand = 'right' if dominant_hand_list.count('right') > 1 else 'left'
            participant_fields_dict['dominant_hand_mode'] = dominant_hand

        participant_id = insert_data_into_table(ParticipantSerializer(data=participant_fields_dict),
                                                'participant_id')

        # for language in language_id_proficiency_dict:
        #     proficiency_id = language_id_proficiency_dict[language]
        #     insert_data_into_table(ParticipantLanguageProficiencySerializer(data={'participant_id': participant_id,
        #                                                                           "language_id": language,
        #                                                                           'proficiency_id': proficiency_id}))

        # Insert to QuestionnaireParticipant
        quest_participant_serializer = QuestionnaireParticipantSerializer(data={
            'questionnaire_id': request.data['questionnaire_id'],
            'participant_id': participant_id,
            'questionnaire_start': request.data['questionnaire_start']})
        insert_data_into_table(quest_participant_serializer)

        # Insert to TaskParticipant
        demo_tasks = TaskSerializer(Task.objects.filter(language_id=language_id), many=True).data
        for task in demo_tasks:
            answer_ids = answer_ids_by_order[task['order_key']]

            for answer_id in answer_ids:
                if free_answers_by_order[task['order_key']] is not None:
                    free_answer = free_answers_by_order[task['order_key']]
                else:
                    free_answer = None
                quest_participant_serializer = TaskParticipantSerializer(data={'participant_id': participant_id,
                                                                               'task_id': task['task_id'],
                                                                               'answer_id': answer_id,
                                                                               'is_demographic': True,
                                                                               'submitted_free_answer': free_answer})
                insert_data_into_table(quest_participant_serializer)

        return Response(status=status.HTTP_201_CREATED)

    @transaction.atomic
    def put(self, request, id):
        return Response(status=status.HTTP_200_OK)

    @transaction.atomic
    def delete(self, request, id):
        return Response(status=status.HTTP_204_NO_CONTENT)


####### INSTRUMENTAL FUNCTIONS #######
def calculate_rtl_ltr_proficiency():
    pass


# POST QuestionnairePreviewAPIView
# insert answer and image to db and associate them with a task
def insert_associate_task_data(association_task_id, data_list, data_id_name, serializer, association_task_serializer):
    # data exists in db
    for data in data_list:
        if data_id_name in data:
            insert_data_into_table(association_task_serializer(data={data_id_name: data[data_id_name],
                                                                     'task_id': association_task_id}))
            continue

        # create data to db
        data_id = insert_data_into_table(serializer(data=data),
                                         data_id_name)

        # associate the new data with the new task
        insert_data_into_table(association_task_serializer(data={data_id_name: data_id,
                                                                 'task_id': association_task_id}))


# POST QuestionnairePreviewAPIView
# params: serializer of a table and name of id field (to return the id of a new entity)
def insert_data_into_table(serializer, id_name=None):
    if serializer.is_valid():
        serializer.save()
    else:
        raise Exception(serializer.errors)

    # return id of new created entity if need
    return serializer.data[id_name] if id_name is not None else -1


# PUT QuestionnairePreviewAPIView
# update answer and image in db or inset them and associate them with a task
def update_associate_task_data(association_task_id, data_list, data_id_name, serializer, association_task_serializer,
                               model_name):
    data_id_list = []
    for data in data_list:
        # data exists in db
        if data_id_name in data:
            data_id_list.append(data[data_id_name])

            # update the data
            try:
                update_serializer = None
                if model_name == 'Answer':
                    model_queryset = Answer.objects.get(answer_id=data[data_id_name])
                    update_serializer = AnswerSerializer(model_queryset, data=data,
                                                         partial=True)
                elif model_name == 'Image':
                    model_queryset = Image.objects.get(image_id=data[data_id_name])
                    update_serializer = ImageSerializer(model_queryset, data=data,
                                                        partial=True)
            except Questionnaire.DoesNotExist:
                return HttpResponse(status=status.HTTP_404_NOT_FOUND)

            update_data_into_table(update_serializer)
            continue

        # create data to db
        data_id = insert_data_into_table(serializer(data=data),
                                         data_id_name)

        data_id_list.append(data_id)

        # associate the new data with the new task
        insert_data_into_table(association_task_serializer(data={data_id_name: data_id,
                                                                 'task_id': association_task_id}))

    if model_name == 'Answer':
        task_answer_queryset = TaskAnswer.objects.filter(task_id=association_task_id).values_list('answer_id')
        split_lst = zip(*task_answer_queryset)
        task_answer_db_ids = list(split_lst)[0]
        answer_ids_to_delete = list(np.setdiff1d(task_answer_db_ids, data_id_list))

        for answer_id in answer_ids_to_delete:
            TaskAnswer.objects.get(answer_id=answer_id).delete()
            Answer.objects.get(answer_id=answer_id).delete()

    if model_name == 'Image':
        task_image_queryset = TaskImage.objects.filter(task_id=association_task_id).values_list('image_id')
        split_lst = zip(*task_image_queryset)
        task_image_db_ids = list(split_lst)[0]
        image_ids_to_delete = list(np.setdiff1d(task_image_db_ids, data_id_list))

        for image_id in image_ids_to_delete:
            TaskImage.objects.get(image_id=image_id).delete()
            Image.objects.get(image_id=image_id).delete()


# PUT QuestionnairePreviewAPIView
# params: serializer
def update_data_into_table(serializer):
    # update due serializer
    if serializer.is_valid():
        serializer.save()
    else:
        raise Exception(serializer.errors)


# DELETE QuestionnairePreviewAPIView, delete_task_in_questionnaire
# params: list of task ids
def delete_tasks(task_ids):
    # lists of key-value {task_id: data}
    answer_ids = []
    image_ids = []

    # get answer, image ids for the tasks
    # delete the tasks
    for task_id in task_ids:
        for ta in TaskAnswer.objects.filter(task_id=task_id):
            answer_ids.append(ta.answer_id_id)
            ta.delete()

        for ti in TaskImage.objects.filter(task_id=task_id):
            image_ids.append(ti.image_id_id)
            ti.delete()

        try:
            task_queryset = Task.objects.get(task_id=task_id)
        except Task.DoesNotExist:
            raise Exception(Task.DoesNotExist)

        task_queryset.delete()

    # delete answer
    for answer_id in answer_ids:
        for answer_queryset in Answer.objects.filter(answer_id=answer_id):
            answer_queryset.delete()

    # delete image
    for image_id in image_ids:
        for image_queryset in Image.objects.filter(image_id=image_id):
            image_queryset.delete()


########################################################################################################################
@api_view(['POST'])
@transaction.atomic
def demo_task_post(request):
    # lists of key-value {task_id: data}
    task_ids = []
    task_answers = []
    task_images = []

    # get parameters for update
    tasks_put = request.data

    # insert or update Task table
    # insert a new task to questionnaire and get id of the new task
    task_id = insert_data_into_table(TaskSerializer(data=tasks_put),
                                     'task_id')

    # map the new task_id with its answers, images
    task_ids.append(task_id)
    task_answers.append({task_id: tasks_put.pop('answers')}) if tasks_put['answers'] else None
    task_images.append({task_id: tasks_put.pop('images')}) if tasks_put['images'] else None

    # insert or update Answer table (the same architecture as Task)
    for task_answer in task_answers:
        task_id = next(iter(task_answer))
        answers = task_answer[task_id]

        for answer in answers:
            if 'answer_id' in answer:
                answer_id = answer['answer_id']
            else:
                serializer = AnswerSerializer(data=answer)
                answer_id = insert_data_into_table(serializer, 'answer_id')

            serializer = TaskAnswerSerializer(data={'task_id': task_id,
                                                    'answer_id': answer_id})
            if serializer.is_valid():
                serializer.save()

    return Response({'task_id': task_ids}, status=status.HTTP_200_OK)
