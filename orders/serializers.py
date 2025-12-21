from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["product", "quantity", "price_at_order"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "address_snapshot",
            "total_price",
            "shipping_fee",
            "payment_method",
            "status",
            "items",
            "created_at",
        ]
