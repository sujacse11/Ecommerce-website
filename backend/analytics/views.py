from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count
from orders.models import Order
from products.models import Product
from django.contrib.auth import get_user_model
from common.permissions import IsSellerRole

User = get_user_model()

class AnalyticsDashboardView(APIView):
    permission_classes = [IsSellerRole]

    def get(self, request):
        user = request.user
        if user.role == 'ADMIN':
            total_sales = Order.objects.aggregate(Sum('final_amount'))['final_amount__sum'] or 0
            total_orders = Order.objects.count()
            total_products = Product.objects.count()
            total_customers = User.objects.filter(role='CUSTOMER').count()

            recent_orders = Order.objects.order_by('-created_at')[:5].values(
                'id', 'user__email', 'final_amount', 'status', 'created_at'
            )

            return Response({
                'role': 'ADMIN',
                'metrics': {
                    'total_sales': float(total_sales),
                    'total_orders': total_orders,
                    'total_products': total_products,
                    'total_customers': total_customers,
                },
                'recent_orders': list(recent_orders)
            })
        else:
            # Seller Analytics
            seller_products = Product.objects.filter(seller=user)
            total_products = seller_products.count()

            # Estimate orders containing seller products
            orders_count = Order.objects.filter(items__product__seller=user).distinct().count()
            total_revenue = Order.objects.filter(items__product__seller=user).distinct().aggregate(Sum('final_amount'))['final_amount__sum'] or 0

            return Response({
                'role': 'SELLER',
                'metrics': {
                    'total_products': total_products,
                    'total_orders': orders_count,
                    'total_revenue': float(total_revenue)
                }
            })
