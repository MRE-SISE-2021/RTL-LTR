# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.

# (Evgeny) The classes were created and modified according to the tutorials:
# https://docs.djangoproject.com/en/3.1/ref/models/options/
# https://django-book.readthedocs.io/en/latest/chapter18.html


from django.db import models


class Component(models.Model):
    component_id = models.AutoField(db_column='ComponentId', primary_key=True)
    component_type = models.CharField(db_column='ComponentType', max_length=10)

    class Meta:
        db_table = 'Component'


class HciBackground(models.Model):
    hci_background_id = models.AutoField(db_column='HciBackgroundId', primary_key=True)
    description = models.CharField(db_column='Description', max_length=50)

    class Meta:
        db_table = 'HciBackground'


class Image(models.Model):
    image_id = models.AutoField(db_column='ImageId', primary_key=True)
    image_url = models.TextField(db_column='ImageUrl')

    class Meta:
        db_table = 'Image'


class Language(models.Model):
    language_id = models.AutoField(db_column='LanguageId', primary_key=True)
    language_name = models.CharField(db_column='LanguageName', max_length=50)
    language_direction = models.CharField(db_column='LanguageDirection', max_length=10)

    class Meta:
        db_table = 'Language'


class QuestionnaireType(models.Model):
    questionnaire_type_id = models.AutoField(db_column='QuestionnaireTypeId', primary_key=True)
    name = models.CharField(db_column='Name', max_length=50)

    class Meta:
        db_table = 'QuestionnaireType'


class Task(models.Model):
    task_id = models.AutoField(db_column='TaskId', primary_key=True)
    title = models.CharField(db_column='Title', max_length=100)
    task_content = models.TextField(db_column='TaskContent', blank=True, null=True)
    language_id = models.ForeignKey(Language, models.DO_NOTHING, db_column='LanguageId')
    is_required = models.BooleanField(db_column='IsRequired')

    class Meta:
        db_table = 'Task'


class Participant(models.Model):
    participant_id = models.AutoField(db_column='ParticipantId', primary_key=True)
    sex = models.CharField(db_column='Sex', max_length=10, blank=True, null=True)
    age = models.IntegerField(db_column='Age', blank=True, null=True)
    mother_tongue = models.ForeignKey(Language, models.DO_NOTHING, db_column='MotherTongue')
    ltr_proficiency = models.FloatField(db_column='LtrProficiency')
    rtl_proficiency = models.FloatField(db_column='RtlProficiency')
    dominant_hand_writing = models.CharField(db_column='DominantHandWriting', max_length=10, blank=True, null=True)
    dominant_hand_mobile = models.CharField(db_column='DominantHandMobile', max_length=10, blank=True, null=True)
    dominant_hand_web = models.CharField(db_column='DominantHandWeb', max_length=10, blank=True, null=True)
    dominant_hand_mode = models.IntegerField(db_column='DominantHandMode', blank=True, null=True)
    is_rtl_speakers = models.BooleanField(db_column='IsRtlSpeakers', blank=True, null=True)
    is_rtl_interface = models.BooleanField(db_column='IsRtlInterface', blank=True, null=True)
    is_rtl_paper_documents = models.BooleanField(db_column='IsRtlPaperDocuments', blank=True, null=True)
    is_ltr_speakers = models.BooleanField(db_column='IsLtrSpeakers', blank=True, null=True)
    is_ltr_interface = models.BooleanField(db_column='IsLtrInterface', blank=True, null=True)
    is_ltr_paper_documents = models.BooleanField(db_column='IsLtrPaperDocuments', blank=True, null=True)
    is_rtl_and_ltr_interface = models.BooleanField(db_column='IsRtlAndLtrInterface', blank=True, null=True)
    other_prof_experience = models.CharField(db_column='OtherProfExperience', max_length=100, blank=True, null=True)
    hci_experience = models.BooleanField(db_column='HciExperience', blank=True, null=True)
    hci_background_id = models.ForeignKey(HciBackground, models.DO_NOTHING, db_column='HciBackgroundId', blank=True,
                                          null=True)
    is_rtl_interfaces_experience = models.BooleanField(db_column='IsRtlInterfacesExperience', blank=True, null=True)
    is_ltr_interfaces_experience = models.BooleanField(db_column='IsLtrInterfacesExperience', blank=True, null=True)
    other_language_working_characteristics = models.CharField(db_column='OtherLanguageWorkingCharacteristics',
                                                              max_length=100, blank=True, null=True)
    questionnaire_version = models.CharField(db_column='QuestionnaireVersion', max_length=10, blank=True, null=True)
    country = models.CharField(db_column='Country', max_length=50, blank=True, null=True)
    operating_system = models.CharField(db_column='OperatingSystem', max_length=20, blank=True, null=True)
    browser_type = models.CharField(db_column='BrowserType', max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'Participant'


class AnswerTask(models.Model):
    answer_id = models.AutoField(db_column='AnswerId', primary_key=True)
    task_id = models.ForeignKey(Task, models.DO_NOTHING, db_column='TaskId')
    answer_content = models.TextField(db_column='AnswerContent')
    is_correct = models.BooleanField(db_column='IsCorrect', blank=True, null=True)

    class Meta:
        db_table = 'AnswerTask'


class ParticipantLanguageProficiency(models.Model):
    participant_id = models.OneToOneField(Participant, models.DO_NOTHING, db_column='ParticipantId', primary_key=True)
    language_id = models.ForeignKey(Language, models.DO_NOTHING, db_column='LanguageId')
    proficiency = models.IntegerField(db_column='Proficiency')

    class Meta:
        db_table = 'ParticipantLanguageProficiency'
        unique_together = (('participant_id', 'language_id'),)


class TaskParticipant(models.Model):
    participant_id = models.OneToOneField(Participant, models.DO_NOTHING, db_column='ParticipantId', primary_key=True)
    task_id = models.ForeignKey(Task, models.DO_NOTHING, db_column='TaskId')
    task_direction = models.CharField(db_column='TaskDirection', max_length=10, blank=True, null=True)
    task_time = models.TimeField(db_column='TaskTime')
    task_clicks = models.IntegerField(db_column='TaskClicks')
    task_errors = models.IntegerField(db_column='TaskErrors')
    answer_id = models.ForeignKey(AnswerTask, models.DO_NOTHING, db_column='AnswerId', blank=True, null=True)
    submitted_free_answer = models.TextField(db_column='SubmittedFreeAnswer', blank=True, null=True)

    class Meta:
        db_table = 'TaskParticipant'
        unique_together = (('participant_id', 'task_id'),)


class Questionnaire(models.Model):
    questionnaire_id = models.AutoField(db_column='QuestionnaireId', primary_key=True)
    name = models.CharField(db_column='Name', max_length=100, blank=True, null=True)
    hosted_link = models.TextField(db_column='HostedLink', blank=True, null=True)
    is_active = models.BooleanField(db_column='IsActive')
    language_id = models.ForeignKey(Language, models.DO_NOTHING, db_column='LanguageId')
    creation_date = models.DateTimeField(db_column='CreationDate', blank=True, null=True)
    questionnaire_type_id = models.ForeignKey(QuestionnaireType, models.DO_NOTHING, db_column='QuestionnaireTypeId',
                                              blank=True, null=True)

    class Meta:
        db_table = 'Questionnaire'


class QuestionnaireParticipant(models.Model):
    questionnaire_id = models.OneToOneField(Questionnaire, models.DO_NOTHING, db_column='QuestionnaireId',
                                            primary_key=True)
    participant_id = models.ForeignKey(Participant, models.DO_NOTHING, db_column='ParticipantId')
    questionnaire_start = models.TimeField(db_column='QuestionnaireStart')
    questionnaire_finish = models.TimeField(db_column='QuestionnaireFinish')
    time_spent = models.TimeField(db_column='TimeSpent', blank=True, null=True)
    satisfaction = models.TextField(db_column='Satisfaction', blank=True, null=True)

    class Meta:
        db_table = 'QuestionnaireParticipant'
        unique_together = (('questionnaire_id', 'participant_id'),)


class QuestionnaireTask(models.Model):
    questionnaire_id = models.OneToOneField(Questionnaire, models.DO_NOTHING, db_column='QuestionnaireId',
                                            primary_key=True)
    task_id = models.ForeignKey(Task, models.DO_NOTHING, db_column='TaskId')

    class Meta:
        db_table = 'QuestionnaireTask'
        unique_together = (('questionnaire_id', 'task_id'),)


class TaskComponent(models.Model):
    task_id = models.OneToOneField(Task, models.DO_NOTHING, db_column='TaskId', primary_key=True)
    component_id = models.ForeignKey(Component, models.DO_NOTHING, db_column='ComponentId')
    direction = models.CharField(db_column='Direction', max_length=10)

    class Meta:
        db_table = 'TaskComponent'
        unique_together = (('task_id', 'component_id'),)


class TaskImage(models.Model):
    task_id = models.OneToOneField(Task, models.DO_NOTHING, db_column='TaskId', primary_key=True)
    image_id = models.ForeignKey(Image, models.DO_NOTHING, db_column='ImageId')

    class Meta:
        db_table = 'TaskImage'
        unique_together = (('task_id', 'image_id'),)
