from django.db import models
from django.contrib.auth.models import User

class Articles(models.Model):
    owner = models.ForeignKey(User, on_delete = models.CASCADE)
    title = models.CharField(max_length=255)
    text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.title