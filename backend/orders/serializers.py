from rest_framework import serializers
from .models import Order, OrderItem, Coupon, Wishlist
from products.serializers import ProductSerializer
from accounts.serializers import AddressSerializer

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'

class WishlistSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ('id', 'products')

class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_details', 'price', 'quantity', 'subtotal')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_address_details = AddressSerializer(source='shipping_address', read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'user', 'shipping_address', 'shipping_address_details',
            'billing_address', 'coupon', 'total_amount', 'discount_amount',
            'final_amount', 'payment_method', 'payment_status', 'status',
            'tracking_number', 'items', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'user', 'tracking_number', 'created_at', 'updated_at')

class CheckoutSerializer(serializers.Serializer):
    shipping_address_id = serializers.IntegerField()
    billing_address_id = serializers.IntegerField(required=False)
    coupon_code = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.ChoiceField(choices=Order.PaymentMethod.choices)
