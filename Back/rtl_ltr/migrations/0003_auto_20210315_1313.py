# Generated by Django 3.0 on 2021-03-15 11:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtl_ltr', '0002_auto_20210311_1609'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='direction',
        ),
        migrations.AddField(
            model_name='task',
            name='is_add_picture',
            field=models.BooleanField(db_column='IsAddPicture', default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='task',
            name='is_direction',
            field=models.BooleanField(db_column='IsDirection', default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='task',
            name='is_new_page',
            field=models.BooleanField(db_column='IsNewPage', default=1),
            preserve_default=False,
        ),
    ]