from django.urls import path
from .views import *


urlpatterns = [
    path('affirmations', affirmations),
    path('articles', articles),
    path('articles/<int:id>/', articlesExact),
    path('articles/latest', articlesLatest),
    path('auth', auth),
    path('register', register)
]
