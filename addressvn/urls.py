from django.urls import path
from .views import ProvinceListView, WardByProvinceView

urlpatterns = [
    path("provinces/", ProvinceListView.as_view()),
    path("provinces/<int:province_id>/wards/", WardByProvinceView.as_view()),
]
