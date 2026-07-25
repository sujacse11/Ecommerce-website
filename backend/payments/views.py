from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from orders.models import Order
import uuid

class ProcessPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        payment_method = request.data.get('payment_method', 'COD')

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        if payment_method == 'COD':
            order.payment_status = Order.PaymentStatus.PAID
            order.save()
            return Response({
                'success': True,
                'message': 'COD payment registered successfully.',
                'order_id': order.id
            })
        elif payment_method == 'STRIPE':
            # Stripe Intent Stub Ready for Keys
            return Response({
                'success': True,
                'client_secret': f"pi_mock_{uuid.uuid4().hex}_secret_stub",
                'payment_method': 'STRIPE',
                'amount': float(order.final_amount),
                'currency': 'usd',
                'message': 'Stripe payment intent generated successfully'
            })
        elif payment_method == 'RAZORPAY':
            # Razorpay Order Stub Ready for Keys
            return Response({
                'success': True,
                'razorpay_order_id': f"order_rzp_mock_{uuid.uuid4().hex[:10]}",
                'payment_method': 'RAZORPAY',
                'amount': int(order.final_amount * 100),
                'currency': 'INR',
                'message': 'Razorpay order created successfully'
            })
        else:
            return Response({'error': 'Unsupported payment method'}, status=status.HTTP_400_BAD_REQUEST)

class PaymentWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, provider=None):
        return Response({'status': 'Webhook received', 'provider': provider})
