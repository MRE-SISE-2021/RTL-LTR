from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt
from .models import *
from .serializers import *


# Create your views here.

################ EXAMPLES OF HTTP REQUESTS ################

# GET an entire table, POST to the table
@csrf_exempt  # does not need csrf token TODO: make the csrf work
def language_test(request):
    if request.method == "GET":
        languages_list = Language.objects.all()
        serializer = LanguageSerializer(languages_list, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = LanguageSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


# GET row from a table by id (pk), PUT (update) the row by id (pk). DELETE by id (pk)
@csrf_exempt
def language_detail_test(request, pk):
    try:
        language = Language.objects.get(pk=pk)
    except Language.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == "GET":
        serializer = LanguageSerializer(language)
        return JsonResponse(serializer.data)
    elif request.method == "PUT":
        data = JSONParser().parse(request)
        serializer = LanguageSerializer(language, data=data,
                                        partial=True)  # partial=True - update specific fields
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)
    elif request == "DELETE":
        language.delete()
        return HttpResponse(status=204)
