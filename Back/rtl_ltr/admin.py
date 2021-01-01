from django.contrib import admin
from django.apps import apps

# Register your models here.

# get all models we have
models = apps.get_models()

# register the models in admin, if the model is already registered, register it anew when the server ups
for model in models:
    if model in admin.site._registry:
        admin.site.unregister(model)
    admin.site.register(model)
