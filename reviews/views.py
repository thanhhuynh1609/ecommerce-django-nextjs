from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Reviews
from orders.models import OrderItem
from .serializer import ReviewSerializer

class CreateReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):
        user = request.user
        rating = request.data.get("rating")
        comment = request.data.get("comment")
        
        if not rating or not comment:
            return Response(
                {"error": "Rating and comment are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        bought = OrderItem.objects.filter(
            order__user=user,
            product_id=product_id,
            order__status="COMPLETED",
        ).exists()
        
        if not bought:
            return Response(
                {"error": "You can only review products you have bought."},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        if Reviews.objects.filter(user=user, product_id=product_id).exists():
            return Response(
                {"error": "You have already reviewed this product."},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
        review = Reviews.objects.create(
            user=user,
            product_id=product_id,
            rating=rating,
            comment=comment,
        )
        
        return Response(
            ReviewSerializer(review).data,
            status=status.HTTP_201_CREATED,
        )
            
        
        
    
