from rest_framework import serializers
from .models import Category, Product, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "parent", "is_active", "created_at"]
        
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image"]
        
        
class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source = "category.name", read_only=True)
    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "description",
            "price", "stock",
            "category", "category_name",
            "thumbnail", "images",
            "is_active", "created_at"
        ]