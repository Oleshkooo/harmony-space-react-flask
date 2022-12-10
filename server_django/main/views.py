from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Articles
from .serializers import *
from .Affirmations import Affirmations
from django.contrib.auth.models import User


affirm = Affirmations()


@api_view(['GET'])
def affirmations(request):
    return Response(affirm.getData())


@api_view(['GET'])
def articles(request):
    article = Articles.objects.all().order_by('-id')
    user = User.objects.all()
    serializerArticle = ArticlesSerializer(article, context={'request': request}, many=True)
    serializerUser = UserSerializer(user, context={'request': request}, many=True)
    return Response({
        'articles': serializerArticle.data,
        'users': serializerUser.data
    })


@api_view(['GET'])
def articlesExact(request, id):
    article = Articles.objects.filter(id=id)
    user = User.objects.filter(id=article[0].owner_id)
    serializerArticle = ArticlesSerializer(article, context={'request': request}, many=True)
    serializerUser = UserSerializer(user, context={'request': request}, many=True)
    return Response({
        'article': serializerArticle.data,
        'user': serializerUser.data
    })

@api_view(['GET'])
def articlesLatest(request):
    article = Articles.objects.all().order_by('-id')[:1]
    user = User.objects.filter(id=article[0].owner_id)
    serializerArticle = ArticlesSerializer(article, context={'request': request}, many=True)
    serializerUser = UserSerializer(user, context={'request': request}, many=True)
    return Response({
        'article': serializerArticle.data,
        'user': serializerUser.data
    })


@api_view(['GET', 'POST'])
def register(request):
    pass


@api_view(['POST'])
def auth(request):
    pass
