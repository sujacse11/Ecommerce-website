from django.urls import path
from .views import ProcessPaymentView, PaymentWebhookView

urlpatterns = [
    path('process/', ProcessPaymentView.as_view(), name='process_payment'),
    path('webhook/<str:provider>/', PaymentWebhookView.as_view(), name='payment_webhook'),
]
