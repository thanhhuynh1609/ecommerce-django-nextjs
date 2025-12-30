# addressvn/models.py
from django.db import models

class Province(models.Model):
    code = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = "province"

    def __str__(self):
        return self.name


class Ward(models.Model):
    code = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name="wards")

    class Meta:
        db_table = "ward"

    def __str__(self):
        return f"{self.name} - {self.province.name}"
