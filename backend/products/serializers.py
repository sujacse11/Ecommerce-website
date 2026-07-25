from rest_framework import serializers
from .models import Category, Brand, Product, ProductImage, Inventory

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ('stock_quantity', 'low_stock_threshold')

class ProductSerializer(serializers.ModelSerializer):
    category_details = CategorySerializer(source='category', read_only=True)
    brand_details = BrandSerializer(source='brand', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    stock = serializers.IntegerField(source='inventory.stock_quantity', read_only=True)
    seller_email = serializers.EmailField(source='seller.email', read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'seller', 'seller_email', 'category', 'category_details',
            'brand', 'brand_details', 'title', 'slug', 'description',
            'price', 'discount_price', 'current_price', 'sku', 'main_image',
            'images', 'stock', 'is_active', 'is_featured', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'slug', 'seller', 'created_at', 'updated_at')

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['seller'] = request.user
        product = super().create(validated_data)
        Inventory.objects.create(product=product, stock_quantity=10)
        return product
