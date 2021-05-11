from __future__ import absolute_import

from celery import shared_task


@shared_task
def insert_participant_data(participant_id, data):
    from cryptography.fernet import Fernet
    from Back.settings import CRYPTO_KEY
    from rtl_ltr.models import Answer, Proficiency, Participant, Questionnaire
    from rtl_ltr.serializers import ParticipantSerializer, AnswerSerializer, ProficiencySerializer, \
        QuestionnaireParticipantSerializer, TaskParticipantSerializer, QuestionnaireSerializer

    rtl_counter = 0
    ltr_counter = 0

    rtl_proficiency_sum = 0
    ltr_proficiency_sum = 0

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

    # for language in language_id_proficiency_dict:
    #     proficiency_id = language_id_proficiency_dict[language]
    #     insert_data_into_table(ParticipantLanguageProficiencySerializer(data={'participant_id': participant_id,
    #                                                                           "language_id": language,
    #                                                                           'proficiency_id': proficiency_id}))

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
    for task in demo_answers:
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

    return {"status": True}


@shared_task
def insert_data_into_table(serializer, id_name=None):
    if serializer.is_valid():
        serializer.save()
    else:
        raise Exception(serializer.errors)

    # return id of new created entity if need
    return {"id": serializer.data[id_name] if id_name is not None else -1}


# PUT QuestionnairePreviewAPIView
# params: serializer
@shared_task
def update_data_into_table(serializer):
    # update due serializer
    if serializer.is_valid():
        serializer.save()
        return {"status": True}
    else:
        raise Exception(serializer.errors)
