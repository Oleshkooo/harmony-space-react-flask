from rest_framework import serializers
from .models import Articles
from django.contrib.auth.models import User

class ArticlesSerializer(serializers.ModelSerializer):
   class Meta:
      model = Articles
      fields = ('pk', 'title', 'text', 'date', 'owner_id')


class UserSerializer(serializers.ModelSerializer):
   class Meta:
      model = User
      fields = ('pk', 'username')