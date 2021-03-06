from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField
from django.shortcuts import get_object_or_404

from .models import *


# Create serializers for the models: convert a model to JSON and vice versa
# AutoField fields will be set to read-only by default

# Dynamic include/exclude fields to/from JSON via Query Params
# Example get : http://127.0.0.1:8000/viewset/language/?fields=language_name
class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class ComponentTypeSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = ComponentType
        fields = '__all__'
        # fields = ['component_id', 'component_type']


class HciBackgroundSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = HciBackground
        fields = '__all__'
        # fields = ['hci_background_id', 'description']


class ImageSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'
        # fields = ['image_id', 'image_url']


class LanguageSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'
        # fields = ['language_id', 'language_name', 'language_direction']


class QuestionnaireTypeSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = QuestionnaireType
        fields = '__all__'
        # fields = ['questionnaire_type_id', 'name']


class ProficiencySerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Proficiency
        fields = '__all__'


class ParticipantSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'


class StudentSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class AnswerSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'
        # fields = ['answer_id', 'task_id', 'answer_content', 'is_correct']


class TaskAnswerSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = TaskAnswer
        fields = '__all__'
        # fields = ['answer_id', 'task_id', 'answer_content', 'is_correct']


class ParticipantLanguageProficiencySerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = ParticipantLanguageProficiency
        fields = '__all__'
        # fields = ['participant_id', 'language_id', 'proficiency']


class TaskParticipantSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = TaskParticipant
        fields = '__all__'
        # fields = ['participant_id', 'task_id', 'task_direction', 'task_time', 'task_clicks', 'task_errors',
        #           'answer_id', 'submitted_free_answer']


class QuestionnaireParticipantSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = QuestionnaireParticipant
        fields = '__all__'
        # fields = ['questionnaire_id', 'participant_id', 'test_started', 'test_completed',
        #           'time_spent_seconds', 'satisfaction']


class QuestionnaireTaskSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = QuestionnaireTask
        fields = '__all__'
        # fields = ['questionnaire_id', 'task_id']


class TaskImageSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = TaskImage
        fields = '__all__'
        # fields = ['task_id', 'image_id']


class TaskSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        # fields = ['task_id', 'title', 'task_content', 'language_id', 'is_required']

    answers = AnswerSerializer(many=True, required=False, read_only=True)
    images = ImageSerializer(many=True, required=False, read_only=True)


class QuestionnaireSerializer(DynamicFieldsModelSerializer):
    creation_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    tasks = TaskSerializer(many=True, required=False)

    class Meta:
        model = Questionnaire
        fields = '__all__'
