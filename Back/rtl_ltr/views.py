from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt
from .models import *
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework import mixins
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from django.shortcuts import get_object_or_404

# Create your views here.

# The best tutorial - https://www.youtube.com/watch?v=B38aDwUpcFc
################ EXAMPLES FOR SIMPLE HTTP REQUESTS ################

# GET an entire table, POST to the table
# @csrf_exempt  # does not need csrf token
# def language_test(request):
#     if request.method == "GET":
#         languages_list = Language.objects.all()
#         serializer = LanguageSerializer(languages_list, many=True)
#         return JsonResponse(serializer.data, safe=False)
#     elif request.method == 'POST':
#         data = JSONParser().parse(request)
#         serializer = LanguageSerializer(data=data)
#
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data, status=201)
#         return JsonResponse(serializer.errors, status=400)
#
#
# # GET row from a table by id (pk), PUT (update) the row by id (pk). DELETE by id (pk)
# @csrf_exempt
# def language_detail_test(request, pk):
#     try:
#         language = Language.objects.get(pk=pk)
#     except Language.DoesNotExist:
#         return HttpResponse(status=404)
#
#     if request.method == "GET":
#         serializer = LanguageSerializer(language)
#         return JsonResponse(serializer.data)
#     elif request.method == "PUT":
#         data = JSONParser().parse(request)
#         serializer = LanguageSerializer(language, data=data,
#                                         partial=True)  # partial=True - update specific fields
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data)
#         return JsonResponse(serializer.errors, status=400)
#     elif request == "DELETE":
#         language.delete()
#         return HttpResponse(status=204)


################ EXAMPLES FOR DECORATOR ################
# @api_view(['GET', 'POST'])
# def language_test(request):
#     if request.method == "GET":
#         languages_list = Language.objects.all()
#         serializer = LanguageSerializer(languages_list, many=True)
#         return Response(serializer.data)
#     elif request.method == 'POST':
#         serializer = LanguageSerializer(data=request.data)
#
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#
# # GET row from a table by id (pk), PUT (update) the row by id (pk). DELETE by id (pk)
# @api_view(['GET', 'PUT', 'DELETE'])
# def language_detail_test(request, pk):
#     try:
#         language = Language.objects.get(pk=pk)
#     except Language.DoesNotExist:
#         return HttpResponse(status=status.HTTP_404_NOT_FOUND)
#
#     if request.method == "GET":
#         serializer = LanguageSerializer(language)
#         return Response(serializer.data)
#     elif request.method == "PUT":
#         serializer = LanguageSerializer(language, data=request.data,
#                                         partial=True)  # partial=True - update specific fields
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     elif request == "DELETE":
#         language.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

################ EXAMPLES FOR CLASS BASED VIEWS ################
# class LanguageAPIView(APIView):
#
#     def get(self, request):
#         languages_list = Language.objects.all()
#         serializer = LanguageSerializer(languages_list, many=True)
#         return Response(serializer.data)
#
#     def post(self, request):
#         serializer = LanguageSerializer(data=request.data)
#
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#
# class LanguageDetailsAPIView(APIView):
#
#     def get_object(self, id):
#         try:
#             return Language.objects.get(language_id=id)
#         except Language.DoesNotExist:
#             return HttpResponse(status=status.HTTP_404_NOT_FOUND)
#
#     def get(self, request, id):
#         language = self.get_object(id)
#         serializer = LanguageSerializer(language)
#         return Response(serializer.data)
#
#     def put(self, request, id):
#         language = self.get_object(id)
#         serializer = LanguageSerializer(language, data=request.data,
#                                         partial=True)  # partial=True - update specific fields
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#     def delete(self, request):
#         language = self.get_object(id)
#         language.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


################ EXAMPLES FOR GENERIC VIEWS AND MIXINS WITH AUTHENTICATION ################
# class GenericLanguageAPIView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin,
#                              mixins.UpdateModelMixin, mixins.RetrieveModelMixin, mixins.DestroyModelMixin):
#     serializer_class = LanguageSerializer
#     queryset = Language.objects.all()
#     lookup_field = 'language_id'
#
#     # authentication
#     # authentication_classes = [SessionAuthentication, BasicAuthentication]
#     # authentication_classes = [TokenAuthentication]
#     # permission_classes = [IsAuthenticated]
#
#     def get(self, request, language_id=None):
#         if language_id:
#             return self.retrieve(request)
#
#         # generic/language_test/0
#         return self.list(request)
#
#     def post(self, request):
#         return self.create(request)
#
#     def put(self, request, language_id=None):
#         return self.update(request, language_id, partial=True)
#
#     def delete(self, request, language_id=None):
#         return self.destroy(request, language_id)

################ EXAMPLES FOR VIEWSETS ################
class LanguageViewSet(viewsets.ViewSet):
    def list(self, request):
        languages_list = Language.objects.all()
        serializer = LanguageSerializer(languages_list, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = LanguageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset = Language.objects.all()
        language = get_object_or_404(queryset, pk=pk)
        serializer = LanguageSerializer(language)
        return Response(serializer.data)
