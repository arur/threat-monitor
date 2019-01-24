from django.db import models

# Create your models here.
class ThreatRecord(models.Model):
    date = models.DateTimeField('date')
    filename = models.CharField(max_length=200)
    action = models.CharField(max_length=200)
    submit_type = models.CharField(max_length=200)
    rating = models.CharField(max_length=200)