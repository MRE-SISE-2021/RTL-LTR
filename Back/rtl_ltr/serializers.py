from rest_framework import serializers
from .models import *


# Create serializers for the models: convert a model to JSON and vice versa
# AutoField fields will be set to read-only by default


class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Component
        fields = ['component_id', 'component_type']


class HciBackgroundSerializer(serializers.ModelSerializer):
    class Meta:
        model = HciBackground
        fields = ['hci_background_id', 'description']


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['image_id', 'image_url']


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['language_id', 'language_name', 'language_direction']


class QuestionnaireTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionnaireType
        fields = ['questionnaire_type_id', 'name']


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['task_id', 'title', 'task_content', 'language_id', 'is_required']


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ['participant_id', 'sex', 'age', 'mother_tongue', 'ltr_proficiency', 'ltr_proficiency',
                  'rtl_proficiency', 'dominant_hand_writing', 'dominant_hand_mobile', 'dominant_hand_web',
                  'dominant_hand_mode', 'is_rtl_speakers', 'is_rtl_interface', 'is_rtl_paper_documents',
                  'is_ltr_speakers', 'is_ltr_interface', 'is_ltr_paper_documents', 'is_rtl_and_ltr_interface',
                  'other_prof_experience', 'hci_experience', 'hci_background_id', 'is_rtl_interfaces_experience',
                  'is_ltr_interfaces_experience', 'other_language_working_characteristics', 'questionnaire_version',
                  'country', 'operating_system', 'browser_type', 'mother_tongue'
                  ]


class AnswerTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerTask
        fields = ['answer_id', 'task_id', 'answer_content', 'is_correct']


class ParticipantLanguageProficiencySerializer(serializers.ModelSerializer):
    class Meta:
        model = ParticipantLanguageProficiency
        fields = ['participant_id', 'language_id', 'proficiency']


class TaskParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskParticipant
        fields = ['participant_id', 'task_id', 'task_direction', 'task_time', 'task_clicks', 'task_errors',
                  'answer_id', 'submitted_free_answer']


class QuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ['questionnaire_id', 'name', 'hosted_link', 'is_active', 'language_id', 'creation_date',
                  'questionnaire_type_id']


class QuestionnaireParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionnaireParticipant
        fields = ['questionnaire_id', 'participant_id', 'questionnaire_start', 'questionnaire_finish',
                  'time_spent', 'satisfaction']


class QuestionnaireTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionnaireTask
        fields = ['questionnaire_id', 'task_id']


class TaskComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskComponent
        fields = ['task_id', 'component_id', 'direction']


class TaskImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskImage
        fields = ['task_id', 'image_id']
