from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
import uuid
from .models import Order, OrderItem, Coupon, Wishlist
from .serializers import OrderSerializer, CheckoutSerializer, CouponSerializer, WishlistSerializer
from cart.models import Cart
from accounts.models import Address
from products.models import Product

class WishlistViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_wishlist(self, user):
        wishlist, created = Wishlist.objects.get_or_create(user=user)
        return wishlist

    def list(self, request):
        wishlist = self.get_wishlist(request.user)
        return Response(WishlistSerializer(wishlist).data)

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        product_id = request.data.get('product_id')
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        wishlist = self.get_wishlist(request.user)
        if product in wishlist.products.all():
            wishlist.products.remove(product)
            message = 'Product removed from wishlist'
        else:
            wishlist.products.add(product)
            message = 'Product added to wishlist'

        return Response({'message': message, 'wishlist': WishlistSerializer(wishlist).data})

class CouponViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Coupon.objects.filter(active=True)
    serializer_class = CouponSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def validate_code(self, request):
        code = request.data.get('code')
        try:
            coupon = Coupon.objects.get(code__iexact=code, active=True)
            now = timezone.now()
            if coupon.valid_from <= now <= coupon.valid_to:
                return Response(CouponSerializer(coupon).data)
            return Response({'error': 'Coupon has expired'}, status=status.HTTP_400_BAD_REQUEST)
        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid coupon code'}, status=status.HTTP_404_NOT_FOUND)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SELLER']:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

    @action(detail=False, methods=['post'])
    def checkout(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        try:
            cart = Cart.objects.get(user=user)
            if not cart.items.exists():
                return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            shipping_address = Address.objects.get(id=serializer.validated_data['shipping_address_id'], user=user)
        except Address.DoesNotExist:
            return Response({'error': 'Shipping address not found'}, status=status.HTTP_404_NOT_FOUND)

        billing_address_id = serializer.validated_data.get('billing_address_id')
        billing_address = shipping_address
        if billing_address_id:
            try:
                billing_address = Address.objects.get(id=billing_address_id, user=user)
            except Address.DoesNotExist:
                pass

        total_amount = cart.total_price
        discount_amount = 0
        coupon = None

        coupon_code = serializer.validated_data.get('coupon_code')
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code__iexact=coupon_code, active=True)
                discount_amount = (total_amount * coupon.discount_percentage) / 100
            except Coupon.DoesNotExist:
                pass

        final_amount = total_amount - discount_amount
        payment_method = serializer.validated_data['payment_method']
        payment_status = Order.PaymentStatus.PAID if payment_method == Order.PaymentMethod.COD else Order.PaymentStatus.PENDING

        order = Order.objects.create(
            user=user,
            shipping_address=shipping_address,
            billing_address=billing_address,
            coupon=coupon,
            total_amount=total_amount,
            discount_amount=discount_amount,
            final_amount=final_amount,
            payment_method=payment_method,
            payment_status=payment_status,
            tracking_number=f"TRK-{uuid.uuid4().hex[:8].upper()}"
        )

        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                price=item.product.current_price,
                quantity=item.quantity
            )

        # Clear cart after checkout
        cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status in [Order.OrderStatus.DELIVERED, Order.OrderStatus.CANCELLED]:
            return Response({'error': 'Cannot cancel order in current state'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = Order.OrderStatus.CANCELLED
        order.save()
        return Response({'message': 'Order cancelled successfully', 'order': OrderSerializer(order).data})
