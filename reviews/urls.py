from django.urls import path
from .views import CreateReviewView

urlpatterns = [
    path("<int:product_id>/", CreateReviewView.as_view()),
]