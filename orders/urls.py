from django.urls import path
from .views import CheckoutView, MyOrderView, OrderDetailView, CancleOrderView, AdminOrderView, UpdateOrderStatusView

urlpatterns = [
    
    path("", AdminOrderView.as_view()),
    path("<int:order_id>/status/",UpdateOrderStatusView.as_view() ),
    path("checkout/", CheckoutView.as_view()),
    path("my-orders/", MyOrderView.as_view()),
    path("<int:order_id>/",OrderDetailView.as_view() ),
    path("<int:order_id>/cancel/",CancleOrderView.as_view() )
    
]
