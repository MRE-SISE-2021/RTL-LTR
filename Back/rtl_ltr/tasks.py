from __future__ import absolute_import

import os
import time

import pandas as pd
import collections
import datetime as dt
import random
import numpy as np
from cryptography.fernet import Fernet
from celery import shared_task
from django.db import transaction
from django.contrib.auth.models import User
from rtl_ltr.models import QuestionnaireParticipant, Answer, Proficiency, Participant, Questionnaire, Language, \
    QuestionnaireTask, Image, Task, TaskImage, TaskAnswer, TaskParticipant, ParticipantLanguageProficiency, \
    UsersLoginLog
from rtl_ltr.serializers import ParticipantSerializer, AnswerSerializer, ProficiencySerializer, \
    QuestionnaireParticipantSerializer, TaskParticipantSerializer, QuestionnaireSerializer, LanguageSerializer, \
    TaskSerializer, QuestionnaireTaskSerializer, ImageSerializer, TaskImageSerializer, TaskAnswerSerializer, \
    ParticipantLanguageProficiencySerializer, StudentSerializer
from Back.settings import CRYPTO_KEY
from Back.settings import PROJECT_HOST


@shared_task
@transaction.atomic
def get_questionnaires_table_task(user):
    try:
        queryset = Questionnaire.objects.all()
        quest_data = list(QuestionnaireSerializer(queryset, many=True).data)

        quest_ids_list = []
        quest_ids_counts_dict = {}

        # New user
        users = list(UsersLoginLog.objects.all().order_by('login_date'))
        last_login = utc_to_local_datetime(users[-2].login_date.replace(tzinfo=None))

        for quest in quest_data:
            count_new_users = 0
            quest_ids_list.append(quest['questionnaire_id'])
            quest_ids_counts_dict[quest['questionnaire_id']] = [0, 0]

            # New Users
            query_set = QuestionnaireParticipant.objects.filter(questionnaire_id=quest['questionnaire_id'])
            quest_participants = QuestionnaireParticipantSerializer(query_set, many=True).data
            for quest_participant in quest_participants:
                date_format = '%Y-%m-%dT%H:%M:%S.%f'
                if '.' not in quest_participant['test_started'][:-1]:
                    date_format = '%Y-%m-%dT%H:%M:%S'
                test_started = dt.datetime.strptime(quest_participant['test_started'][:-1], date_format)
                if test_started is None or last_login is None:
                    continue
                if test_started.replace(tzinfo=None) > last_login.replace(tzinfo=None):
                    count_new_users += 1
            quest_ids_counts_dict[quest['questionnaire_id']][1] = count_new_users

        query_set = QuestionnaireParticipant.objects.filter(questionnaire_id__in=quest_ids_list)
        data = QuestionnaireParticipantSerializer(query_set, many=True).data

        for quest_participant in data:
            quest_ids_counts_dict[quest_participant['questionnaire_id']][0] += 1

        for quest in quest_data:
            quest['num_participated'] = quest_ids_counts_dict[quest['questionnaire_id']][0]
            quest['num_from_last_login'] = quest_ids_counts_dict[quest['questionnaire_id']][1]
    except Exception as e:
        raise e

    return quest_data


@shared_task
@transaction.atomic
def get_questionnaire_by_hosted_link_task(request):
    try:
        fernet = Fernet(CRYPTO_KEY)
        decrypted_hash = fernet.decrypt(request.GET.get('hash', '').encode()).decode()
        quest_language_ids = decrypted_hash.split("_")

        request.GET._mutable = True
        request.GET['language'] = quest_language_ids[1]
        request.GET._mutable = False
    except Exception as e:
        raise e

    return request, quest_language_ids[0]


@shared_task
@transaction.atomic
def get_questionnaire_task(questionnaire_id):
    participant_ids_list = []

    nums_participated = 0
    nums_dropped = 0
    ages = {}
    native_languages = {}
    last_date = None

    try:
        query_set = QuestionnaireParticipant.objects.filter(questionnaire_id=questionnaire_id)
        data = QuestionnaireParticipantSerializer(query_set, many=True).data

        for quest_participant in data:
            participant_ids_list.append(quest_participant['participant_id'])

            nums_participated += 1
            if quest_participant['test_completed'] is None:
                nums_dropped += 1
            else:
                date_format = '%Y-%m-%dT%H:%M:%S.%f'
                if '.' not in quest_participant['test_completed']:
                    date_format = '%Y-%m-%dT%H:%M:%S'
                test_completed = dt.datetime.strptime(quest_participant['test_completed'][:-1], date_format)
                if test_completed is not None and last_date is None:
                    last_date = test_completed
                last_date = test_completed if test_completed > last_date else last_date
            query_set = Participant.objects.filter(participant_id__in=participant_ids_list)
            data = ParticipantSerializer(query_set, many=True).data

        for participant in data:
            if participant['age'] in ages:
                ages[participant['age']] += 1
            else:
                ages[participant['age']] = 1
            if participant['native_language'] in native_languages:
                native_languages[participant['native_language']] += 1
            else:
                native_languages[participant['native_language']] = 1

            languages = LanguageSerializer(Language.objects.filter(), many=True).data

        language_name_count_dict = {}
        other_lang = {}
        for key in native_languages:
            language_id = -1
            if key is None:
                for language in languages:
                    if language['language_name'] == 'Other':
                        other_lang[language['language_name']] = native_languages[key]
                        continue
            else:
                language_id = key - 1
                language_name = languages[language_id]['language_name']
                language_name_count_dict[language_name] = native_languages[key]

        ages = collections.OrderedDict(sorted(ages.items()))
        ages_x = list(ages.keys())
        ages_y = list(ages.values())

        native_languages = {**dict(collections.OrderedDict(sorted(language_name_count_dict.items()))), **other_lang}

        native_languages_x = list(native_languages.keys())
        native_languages_y = list(native_languages.values())

        query_set = Questionnaire.objects.get(questionnaire_id=questionnaire_id)
        questionnaire_data = QuestionnaireSerializer(query_set).data

        questionnaire_data['nums_participated'] = nums_participated
        questionnaire_data['nums_dropped'] = nums_dropped
        questionnaire_data['last_date'] = last_date
        questionnaire_data['ages_x'] = ages_x
        questionnaire_data['ages_y'] = ages_y
        questionnaire_data['native_languages_x'] = native_languages_x
        questionnaire_data['native_languages_y'] = native_languages_y
    except Exception as e:
        raise e

    return questionnaire_data


@shared_task
@transaction.atomic
def delete_task_from_questionnaire_task(data, id):
    try:
        # validate request
        if 'task_id' not in data:
            return {"status": 'task_id not in data'}

        # get parameters for update
        task_ids = []

        # get queryset of questionnaire_task table by task_i
        qt = QuestionnaireTask.objects.get(task_id=data['task_id'], questionnaire_id=id)

        task_ids.append(qt.task_id_id)
        qt.delete()

        delete_tasks(task_ids)
    except Exception as e:
        raise e

    return {"status": True}


@shared_task
@transaction.atomic
def get_preview_data_task(language_id, questionnaire_id):
    try:
        questionnaire_queryset = Questionnaire.objects.get(questionnaire_id=questionnaire_id)
        data = QuestionnaireSerializer(questionnaire_queryset, many=False).data

        # get demographic tasks by task_type_id
        demographic_task_queryset = Task.objects.filter(language_id=language_id)
        demographic_tasks = TaskSerializer(demographic_task_queryset, many=True).data

        for task in demographic_tasks:
            is_other = False
            answer = []
            other = None
            for raw_answer in task['answers']:
                if raw_answer['value'] == 'Other':
                    other = raw_answer
                    is_other = True
                    continue
                answer.append(raw_answer)
            if is_other:
                answer.append(other)
                task['answers'] = answer
        data['demographic_task'] = demographic_tasks

        tasks = data['tasks']
        tasks_without_instructions = []
        instructions = []
        for task in tasks:
            if task['component_type_id'] == 12:
                instructions.append(task)
            else:
                tasks_without_instructions.append(task)
        tasks_without_instructions = shuffle_tasks(tasks_without_instructions)
        for i in range(1, len(instructions) + 1):
            tasks_without_instructions.insert(i, instructions[i-1])
        data['tasks'] = tasks_without_instructions
    except Exception as e:
        raise e

    return data


@shared_task
@transaction.atomic
def insert_questionnaire_tasks_task(data):
    """
    Creates new questionnaire
    :param data: dict with questionnaire params
    :return: questionnaire_id
    """
    try:
        data.pop('tasks')
        questionnaire_table_data = data

        # get demographic
        if 'demographic' in questionnaire_table_data:
            for key in questionnaire_table_data['demographic']:
                questionnaire_table_data[key] = questionnaire_table_data['demographic'][key]

        # create a new questionnaire in the table and get its id
        questionnaire_id = insert_data_into_table(QuestionnaireSerializer(data=questionnaire_table_data),
                                                  'questionnaire_id')

        # Create hosted link
        fernet = Fernet(CRYPTO_KEY)
        raw_hosted_link = str(questionnaire_id) + "_" + str(questionnaire_table_data['language_id'])
        hosted_link = fernet.encrypt(raw_hosted_link.encode())

        index = len(Questionnaire.objects.select_for_update()) - 1
        update_data_into_table(QuestionnaireSerializer(Questionnaire.objects.select_for_update()[index],
                                                       data={'hosted_link': PROJECT_HOST + 'survey/' +
                                                                            hosted_link.decode()}, partial=True))
    except Exception as e:
        raise e

    return questionnaire_id


@shared_task
@transaction.atomic
def update_questionnaire_tasks_task(data, questionnaire_id):
    """
    Add task to questionnaire
    :param data: tasks params
    :param questionnaire_id: questionnaire_id to add the task
    :return: questionnaire_id, list of task_ids
    """
    try:
        # lists of key-value {task_id: data}
        task_ids = []
        task_answers = []
        task_images = []

        # get parameters for update
        questionnaire_put = data
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
        questionnaire_queryset = Questionnaire.objects.get(questionnaire_id=questionnaire_id)

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
                except Exception as e:
                    raise e

                update_data_into_table(TaskSerializer(task_queryset, data=task,
                                                      partial=True))
                continue

            # insert a new task to questionnaire and get id of the new task
            task_id = insert_data_into_table(TaskSerializer(data=task),
                                             'task_id')

            # map the new task_id with its answers, images
            task_ids.append(task_id)
            task_answers.append({task_id: task.pop('answers')}) if task['answers'] else None
            task_images.append({task_id: task.pop('images')}) if 'images' in task and task['images'] else None

            # associate the new task with the new questionnaire
            insert_data_into_table(QuestionnaireTaskSerializer(data={'questionnaire_id': questionnaire_id,
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
    except Exception as e:
        raise e

    return questionnaire_id, task_ids


@shared_task
@transaction.atomic
def delete_questionnaire_tasks_task(questionnaire_id):
    try:
        # lists of key-value {task_id: data}
        task_ids = []
        participant_ids = []

        # get queryset of questionnaire_task table by questionnaire_id
        for qt in QuestionnaireTask.objects.filter(questionnaire_id=questionnaire_id):
            task_ids.append(qt.task_id_id)
            qt.delete()

        for qp in QuestionnaireParticipant.objects.filter(questionnaire_id=questionnaire_id):
            participant_ids.append(qp.participant_id_id)
            qp.delete()

        # get queryset of questionnaire table by questionnaire_id
        questionnaire_queryset = Questionnaire.objects.get(questionnaire_id=questionnaire_id)

        # delete questionnaire by id from db Questionnaire table
        questionnaire_queryset.delete()
        delete_tasks(task_ids)

        for participant_id in participant_ids:
            for participant_queryset in ParticipantLanguageProficiency.objects.filter(participant_id=participant_id):
                participant_queryset.delete()

    except Exception as e:
        raise e

    return {'status': True}


@shared_task
@transaction.atomic
def insert_participant_data_task(participant_id, data):
    try:
        rtl_counter = 0
        ltr_counter = 0

        rtl_proficiency_sum = 0
        ltr_proficiency_sum = 0

        false_language_ids = []
        fernet = Fernet(CRYPTO_KEY)
        demo_answers = data['demo_answers']
        language_id_proficiency_dict = {}
        participant_fields_dict = {}

        answer_ids_by_order = {}  # key = order_key, value = answer_id
        free_answers_by_order = {}  # key = order_key, value = answer_id

        questionnaire_id = fernet.decrypt(data['hash'].encode()).decode().split("_")[0]

        questionnaire_data = QuestionnaireSerializer(
            Questionnaire.objects.get(questionnaire_id=questionnaire_id)).data

        participant_fields_dict['questionnaire_language'] = questionnaire_data['language_id']
        participant_fields_dict['questionnaire_direction'] = questionnaire_data['direction']

        all_demo_answers = {}
        all_demo_answers_raw = AnswerSerializer(Answer.objects.filter(is_demographic=True), many=True).data

        if 'id' in demo_answers:
            insert_data_into_table(StudentSerializer(data={'passport_id': demo_answers.pop('id'),
                                                           'student_name': demo_answers.pop('name'),
                                                           'participant_id': participant_id}))

        for all_demo_answer in all_demo_answers_raw:
            all_demo_answers[all_demo_answer['answer_id']] = all_demo_answer

        for task_id in demo_answers:
            demo_answer = demo_answers[task_id]
            order_key = demo_answer['order_key']

            if order_key == 1:  # How old are you?
                answer_ids_by_order[order_key] = [None]
                free_answers_by_order[order_key] = demo_answer['submitted_free_answer']
                participant_fields_dict['age'] = int(demo_answer['submitted_free_answer'])

            elif order_key == 2:  # Your native language (select the correct answer):
                answer_ids_by_order[order_key] = [demo_answer['answer_id']]
                if 'submitted_free_answer' in demo_answer:
                    free_answers_by_order[order_key] = demo_answer['submitted_free_answer']

                answer = all_demo_answers[demo_answer['answer_id']]
                participant_fields_dict['native_language'] = int(answer['value']) if answer[
                                                                                         'value'] != 'Other' else None

                prof_id = ProficiencySerializer(
                    Proficiency.objects.get(proficiency_description='Native language')).data['proficiency_id']
                if answer['value'] != 'Other':
                    language_id_proficiency_dict[int(answer['value'])] = prof_id

            elif order_key == 3:  # "What other languages do you know (you can choose several options)?"
                answer_ids_by_order[order_key] = []
                for key in demo_answer:
                    try:
                        if demo_answer[key] is False:
                            false_language_ids.append(int(all_demo_answers[int(key)]['value']))
                            continue
                        answer_ids_by_order[order_key].append(int(key))
                    except ValueError:
                        continue

                if 'submitted_free_answer' in demo_answer:
                    free_answers_by_order[order_key] = demo_answer['submitted_free_answer']

            elif order_key == 4:  # <Language> knowledge:
                for language_id in demo_answer:
                    if language_id == 'order_key' or language_id in false_language_ids:
                        continue
                    for answers_id in demo_answer[language_id]:
                        proficiency_id = int(all_demo_answers[int(answers_id)]['value'])
                        if isinstance(language_id, int):
                            language_id_proficiency_dict[int(language_id)] = proficiency_id

            elif order_key == 5:  # What characterizes your core daily work (several options)?
                answer_ids_by_order[order_key] = []
                for key in demo_answer:
                    try:
                        answer_ids_by_order[order_key].append(int(key))
                    except ValueError:
                        continue
                if 'submitted_free_answer' in demo_answer:
                    free_answers_by_order[order_key] = demo_answer['submitted_free_answer']

                # If the question is not chosen by researcher save null to the table, if chosen: save True/False
                # Here the question chosen so need to fill the options with False and change it to True if submitted
                participant_fields_dict['is_rtl_speakers'] = False
                participant_fields_dict['is_rtl_interface'] = False
                participant_fields_dict['is_rtl_paper_documents'] = False
                participant_fields_dict['is_ltr_speakers'] = False
                participant_fields_dict['is_ltr_interface'] = False
                participant_fields_dict['is_ltr_paper_documents'] = False
                for id in answer_ids_by_order[order_key]:
                    answer = all_demo_answers[id]
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

            elif order_key == 6:  # Which hand do you prefer to use when writing?
                answer_ids_by_order[order_key] = [demo_answer['answer_id']]
                answer = all_demo_answers[demo_answer['answer_id']]
                participant_fields_dict['dominant_hand_writing'] = answer['answer_content'].replace('.', '').lower()

            elif order_key == 7:  # Which hand do you prefer to use when scrolling on the mobile phone?
                answer_ids_by_order[order_key] = [demo_answer['answer_id']]
                answer = all_demo_answers[demo_answer['answer_id']]
                participant_fields_dict['dominant_hand_mobile'] = answer['answer_content'].replace('.', '').lower()

            elif order_key == 8:  # Which hand do you prefer to use when holding a computer mouse?
                answer_ids_by_order[order_key] = [demo_answer['answer_id']]
                answer = all_demo_answers[demo_answer['answer_id']]
                participant_fields_dict['dominant_hand_mouse'] = answer['answer_content'].replace('.', '').lower()

            elif order_key == 9:  # Do you have professional experience in UX, UI design or development?
                answer_ids_by_order[order_key] = [demo_answer['answer_id']]
                answer = all_demo_answers[demo_answer['answer_id']]
                participant_fields_dict['is_hci_experience'] = int(answer['value'])

            elif order_key == 10:  # Your professional HCI experience is mainly in:
                answer_ids_by_order[order_key] = [demo_answer['answer_id']]
                answer = all_demo_answers[demo_answer['answer_id']]
                participant_fields_dict['hci_background_id'] = int(answer['value'])

            elif order_key == 11:  # In what languages were the interfaces that you developed?
                answer_ids_by_order[order_key] = []
                for key in demo_answer:
                    try:
                        answer_ids_by_order[order_key].append(int(key))
                    except ValueError:
                        continue
                if 'submitted_free_answer' in demo_answer:
                    free_answers_by_order[order_key] = demo_answer['submitted_free_answer']

                # If the question is not chosen by researcher save null to the table, if chosen: save True/False
                # Here the question chosen so need to fill the options with False and change it to True if submitted
                participant_fields_dict['is_rtl_interfaces_experience'] = False
                participant_fields_dict['is_ltr_interfaces_experience'] = False
                for id in answer_ids_by_order[order_key]:
                    answer_value = all_demo_answers[id]['value']
                    if answer_value == '1':
                        participant_fields_dict['is_rtl_interfaces_experience'] = True
                    if answer_value == '2':
                        participant_fields_dict['is_ltr_interfaces_experience'] = True

        for language_id in language_id_proficiency_dict:
            language_data = LanguageSerializer(Language.objects.get(language_id=language_id)).data

            language_id = language_data['language_id']
            language_direction = language_data['language_direction']

            # rtl and ltr proficiency
            if language_direction == 'RTL':
                rtl_counter += 1
                rtl_proficiency_sum += language_id_proficiency_dict[language_id]
            elif language_direction == 'LTR':
                ltr_counter += 1
                ltr_proficiency_sum += language_id_proficiency_dict[language_id]

        participant_fields_dict['rtl_proficiency'] = rtl_proficiency_sum / rtl_counter if rtl_counter > 0 else 0
        participant_fields_dict['ltr_proficiency'] = ltr_proficiency_sum / ltr_counter if ltr_counter > 0 else 0

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

        for language_id in language_id_proficiency_dict:
            proficiency_id = language_id_proficiency_dict[language_id]
            insert_data_into_table(ParticipantLanguageProficiencySerializer(data={'participant_id': participant_id,
                                                                                  "language_id": language_id,
                                                                                  'proficiency_id': proficiency_id}))

        for key in data['statsInfo']:
            participant_fields_dict[key] = data['statsInfo'][key]

        update_data_into_table(ParticipantSerializer(Participant.objects.get(participant_id=participant_id),
                                                     data=participant_fields_dict,
                                                     partial=True))
        # Insert to QuestionnaireParticipant
        quest_participant_serializer = QuestionnaireParticipantSerializer(data={
            'questionnaire_id': questionnaire_id,
            'participant_id': participant_id,
            'test_started': data['test_started']})
        insert_data_into_table(quest_participant_serializer)

        # Insert to TaskParticipant
        for task_id in demo_answers:
            order_key = demo_answers[task_id]['order_key']
            if order_key in answer_ids_by_order:
                answer_ids = answer_ids_by_order[order_key]
            else:
                continue

            for answer_id in answer_ids:
                if order_key in free_answers_by_order and free_answers_by_order[order_key]:
                    free_answer = free_answers_by_order[order_key]
                else:
                    free_answer = None
                quest_participant_serializer = TaskParticipantSerializer(data={'participant_id': participant_id,
                                                                               'task_id': task_id,
                                                                               'answer_id': answer_id,
                                                                               'is_demographic': True,
                                                                               'submitted_free_answer': free_answer})
                insert_data_into_table(quest_participant_serializer)

    except Exception as e:
        raise e
    return {"status": True}


def get_csv_data_task(quest_id):
    query_set = Participant.objects.raw('select '
                                        'Participant.ParticipantId as "ParticipantId", '
                                        'Questionnaire.QuestionnaireName, '
                                        'Task.Label as "TaskLabel", '
                                        'Answer.AnswerContent, '
                                        'TaskParticipant.SubmittedFreeAnswer, '
                                        'Answer.Value, '
                                        'ComponentType.ComponentType, '
                                        'TaskParticipant.IsDemographic, '
                                        'TaskParticipant.TaskDirection, '
                                        'TaskParticipant.TaskClicks, '
                                        'TaskParticipant.TaskErrors, '
                                        'QuestionnaireParticipant.TestStarted, '
                                        'QuestionnaireParticipant.TestCompleted, '
                                        'QuestionnaireParticipant.TimeSpentSeconds, '
                                        'Participant.QuestionnaireDirection as "questionnaire_aligment", '
                                        'Questionnaire.CreationDate, '
                                        'Questionnaire.HostedLink, '
                                        'Questionnaire.LanguageId as "Questionnaire_Language", '
                                        'Questionnaire.QuestionnaireId, '
                                        'TaskParticipant.TaskId, '
                                        'TaskParticipant.AnswerId, '
                                        # 'HciBackground.HciBackgroundDescription,'
                                        'Participant.Age, '
                                        'Participant.NativeLanguage, '
                                        'Participant.LtrProficiency, '
                                        'Participant.RtlProficiency, '
                                        'Participant.DominantHandWriting, '
                                        'Participant.DominantHandMobile, '
                                        'Participant.DominantHandMouse, '
                                        'Participant.DominantHandMode,'
                                        'Participant.IsRtlSpeakers,'
                                        'Participant.IsRtlInterface,'
                                        'Participant.IsRtlPaperDocuments,'
                                        'Participant.IsLtrSpeakers,'
                                        'Participant.IsLtrInterface,'
                                        'Participant.IsLtrPaperDocuments,'
                                        'Participant.IsRtlAndLtrInterface,'
                                        'Participant.OtherProfExperience,'
                                        'Participant.IsRtlInterfacesExperience,'
                                        'Participant.IsLtrInterfacesExperience,'
                                        'Participant.OtherLanguageWorkingCharacteristics,'
                                        'Participant.IsHciExperience,'
                                        'Participant.Country,'
                                        'Participant.OperatingSystem, '
                                        'ParticipantLanguageProficiency.LanguageId as proficiency_language, '
                                        'ParticipantLanguageProficiency.ProficiencyId as Proficiency '

                                        'from Participant '
                                        'inner join TaskParticipant on Participant.ParticipantId = TaskParticipant.ParticipantId '
                                        'inner join QuestionnaireParticipant on QuestionnaireParticipant.ParticipantId = TaskParticipant.ParticipantId '
                                        'inner join Task on TaskParticipant.TaskId = Task.TaskId '
                                        'inner join Answer on TaskParticipant.AnswerId = Answer.AnswerId '
                                        'inner join Questionnaire on QuestionnaireParticipant.QuestionnaireId = Questionnaire.QuestionnaireId '
                                        'inner join ComponentType on ComponentType.ComponentTypeId = Task.ComponentTypeId '
                                        # 'inner join HciBackground on HciBackground.HciBackgroundId = Participant.HciBackgroundId '
                                        'inner join ParticipantLanguageProficiency on ParticipantLanguageProficiency.ParticipantId = Participant.ParticipantId '
                                        'where QuestionnaireParticipant.QuestionnaireId = %s', params=[quest_id])

    languages_raw = LanguageSerializer(Language.objects.filter(), many=True).data
    languages = {}
    for language in languages_raw:
        languages[language['language_id']] = language['language_name']
    df = pd.DataFrame([item.__dict__ for item in query_set])
    df.fillna('', inplace=True)
    if "Questionnaire_Language" in df:
        df["Questionnaire_Language"].replace(languages, inplace=True)
    if "native_language_id" in df:
        df["native_language_id"].replace(languages, inplace=True)
    if "proficiency_language" in df:
        df["proficiency_language"].replace(languages, inplace=True)
    if "_state" in df:
        df.drop(columns=['_state'], inplace=True)
    return df


def get_csv_student_task(quest_id):
    query_set = Participant.objects.raw('SELECT '
                                        'Student.PassportId, '
                                        'Student.StudentName, '
                                        'QuestionnaireParticipant.TestStarted, '
                                        'QuestionnaireParticipant.TestCompleted, '
                                        'Questionnaire.QuestionnaireName, '
                                        'QuestionnaireParticipant.QuestionnaireId, '
                                        'Student.ParticipantId '
                                        'FROM Student '
                                        'inner join QuestionnaireParticipant '
                                        'on QuestionnaireParticipant.ParticipantId = Student.ParticipantId '
                                        'inner join Questionnaire '
                                        'on Questionnaire.QuestionnaireId = QuestionnaireParticipant.QuestionnaireId '
                                        'where QuestionnaireParticipant.QuestionnaireId = %s', params=[quest_id])

    df = pd.DataFrame([item.__dict__ for item in query_set])
    df.fillna('', inplace=True)
    if "_state" in df:
        df.drop(columns=['_state'], inplace=True)
    return df

@shared_task
@transaction.atomic
def insert_participant_task_data_task(request_data, id):
    task_participant_data = []

    try:
        for task_id in request_data['answers']:
            task = request_data['answers'][task_id]

            submitted_free_answer = request_data['answers'][task_id]['submitted_free_answer'] \
                if 'submitted_free_answer' in request_data['answers'][task_id] else None
            if isinstance(submitted_free_answer, list):
                submitted_free_answer = ','.join(map(str, submitted_free_answer))

            answer_ids = []
            if task['comp_type'] == 8:
                for key in task:
                    if isinstance(key, int) and task[key] is True:
                        answer_ids.append(key)
            else:
                answer_ids.append(task['answer_id'] if 'answer_id' in request_data['answers'][task_id] else None)

            for answer_id in answer_ids:
                task_participant_data.append({'participant_id': id,
                                              'task_id': task_id,
                                              'answer_id': answer_id,
                                              'task_direction': task['task_direction'],
                                              'task_time': None,
                                              'task_clicks': task['task_clicks'],
                                              'task_errors': None,
                                              'submitted_free_answer': submitted_free_answer
                                              })

        for data in task_participant_data:
            insert_data_into_table(TaskParticipantSerializer(data=data))

        if 'test_completed' in request_data:
            fernet = Fernet(CRYPTO_KEY)
            decrypted_hash = fernet.decrypt(request_data['hash'].encode()).decode()
            quest_language_ids = decrypted_hash.split("_")

            query_set = QuestionnaireParticipant.objects.get(questionnaire_id=quest_language_ids[0],
                                                             participant_id=id)

            test_started = dt.datetime.strptime(QuestionnaireParticipantSerializer(query_set).data['test_started'][:-1],
                                                '%Y-%m-%dT%H:%M:%S.%f')
            test_completed = dt.datetime.strptime(request_data['test_completed'], '%Y-%m-%d %H:%M:%S.%f')

            time_spent_seconds = (test_completed - test_started).total_seconds()

            update_data_into_table(QuestionnaireParticipantSerializer(query_set,
                                                                      data={'test_completed':
                                                                                request_data['test_completed'],
                                                                            'time_spent_seconds': time_spent_seconds},
                                                                      partial=True))
    except Exception as e:
        raise e
    return {"status": True}


# POST QuestionnairePreviewAPIView
# params: serializer of a table and name of id field (to return the id of a new entity)
def insert_data_into_table(serializer, id_name=None):
    if serializer.is_valid():
        serializer.save()
    else:
        raise Exception(serializer.errors)

    # return id of new created entity if need
    return serializer.data[id_name] if id_name is not None else -1


@transaction.atomic
def insert_data_into_table(serializer, id_name=None):
    if serializer.is_valid():
        serializer.save()
    else:
        raise Exception(serializer.errors)

    # return id of new created entity if need
    return {"id": serializer.data[id_name] if id_name is not None else -1}


# PUT QuestionnairePreviewAPIView
# params: serializer
@transaction.atomic
def update_data_into_table(serializer):
    # update due serializer
    if serializer.is_valid():
        serializer.save()
        return {"status": True}
    else:
        raise Exception(serializer.errors)


def shuffle_tasks(tasks):
    try:
        if len(tasks) > 2:
            open_task = tasks.pop(0)
            final_task = tasks.pop(-1)

            random.shuffle(tasks)
            tasks.insert(0, open_task)
            tasks.append(final_task)
    except Exception as e:
        raise e

    return tasks


# DELETE QuestionnairePreviewAPIView, delete_task_in_questionnaire
# params: list of task ids
def delete_tasks(task_ids):
    # lists of key-value {task_id: data}
    answer_ids = []
    image_ids = []

    try:
        # get answer, image ids for the tasks
        # delete the tasks
        for task_id in task_ids:
            for ta in TaskAnswer.objects.filter(task_id=task_id):
                answer_ids.append(ta.answer_id_id)
                ta.delete()

            for ti in TaskImage.objects.filter(task_id=task_id):
                image_ids.append(ti.image_id_id)
                ti.delete()

            for tp in TaskParticipant.objects.filter(task_id=task_id):
                tp.delete()

            for qt in QuestionnaireTask.objects.filter(task_id=task_id):
                qt.delete()

            task_queryset = Task.objects.get(task_id=task_id)
            task_queryset.delete()

        # delete answer
        for answer_id in answer_ids:
            for answer_queryset in Answer.objects.filter(answer_id=answer_id):
                answer_queryset.delete()

        # delete image
        for image_id in image_ids:
            for image_queryset in Image.objects.filter(image_id=image_id):
                image_queryset.delete()

    except Exception as e:
        raise e

    return {'status': True}


# POST QuestionnairePreviewAPIView
# insert answer and image to db and associate them with a task
def insert_associate_task_data(association_task_id, data_list, data_id_name, serializer, association_task_serializer):
    try:
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
    except Exception as e:
        raise e

    return {'status': True}


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
    try:
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
                except Exception as e:
                    raise e

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
    except Exception as e:
        raise e


# PUT QuestionnairePreviewAPIView
# params: serializer
def update_data_into_table(serializer):
    # update due serializer
    if serializer.is_valid():
        serializer.save()
    else:
        raise Exception(serializer.errors)


EPOCH_DATETIME = dt.datetime(1970, 1, 1)
SECONDS_PER_DAY = 24 * 60 * 60


def utc_to_local_datetime(utc_datetime):
    delta = utc_datetime - EPOCH_DATETIME
    utc_epoch = SECONDS_PER_DAY * delta.days + delta.seconds
    # os.environ['TZ'] = 'Asia/Jerusalem'
    # time.tzset()
    time_struct = time.localtime(utc_epoch)
    dt_args = time_struct[:6] + (delta.microseconds,)
    return dt.datetime(*dt_args)
