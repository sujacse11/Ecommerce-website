from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from products.models import Product
from orders.models import Order
import os
import requests

class AIChatbotView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        message = request.data.get('message', '').strip().lower()
        if not message:
            return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Rule-based Engine & Database Queries
        if 'return' in message or 'policy' in message or 'refund' in message:
            return Response({
                'response': 'We offer a 30-day hassle-free return policy on all items. You can initiate a return directly from your Order Details page.'
            })

        if 'shipping' in message or 'delivery' in message:
            return Response({
                'response': 'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days.'
            })

        if 'track' in message or 'order status' in message:
            if request.user and request.user.is_authenticated:
                try:
                    last_order = Order.objects.filter(user=request.user).order_by('-created_at').first()
                    if last_order:
                        return Response({
                            'response': f"Your latest Order #{last_order.id} is currently '{last_order.status}' with tracking number {last_order.tracking_number}."
                        })
                    return Response({'response': 'You have no recent orders to track.'})
                except Exception:
                    return Response({'response': 'Unable to retrieve order history at the moment.'})
            return Response({'response': 'Please log in to track your active orders.'})

        if 'product' in message or 'recommend' in message or 'search' in message or 'laptop' in message:
            try:
                keywords = [w for w in message.split() if w not in ['search', 'recommend', 'product', 'for', 'a', 'the', 'show']]
                query_filter = Product.objects.filter(is_active=True)
                if keywords:
                    query_filter = query_filter.filter(title__icontains=keywords[0])
                items = query_filter[:4]

                if items.exists():
                    products_list = [{'id': p.id, 'title': p.title, 'price': str(p.price)} for p in items]
                    return Response({
                        'response': f"Here are matching products from our catalog:",
                        'products': products_list
                    })
            except Exception:
                pass

        # 2. Groq LLM API Integration
        groq_key = os.getenv('GROQ_API_KEY')
        if groq_key and not groq_key.startswith('gsk_sample'):
            try:
                headers = {'Authorization': f'Bearer {groq_key}', 'Content-Type': 'application/json'}
                payload = {
                    'model': 'llama-3.3-70b-versatile',
                    'messages': [
                        {'role': 'system', 'content': 'You are an AI shopping assistant for AuraStore. Provide helpful, concise shopping advice.'},
                        {'role': 'user', 'content': message}
                    ],
                    'max_tokens': 200
                }
                res = requests.post('https://api.groq.com/openai/v1/chat/completions', json=payload, headers=headers, timeout=5)
                if res.status_code == 200:
                    answer = res.json()['choices'][0]['message']['content']
                    return Response({'response': answer})
            except Exception:
                pass

        # 3. OpenAI LLM Fallback
        openai_key = os.getenv('OPENAI_API_KEY')
        if openai_key and not openai_key.startswith('sk-proj-sample'):
            try:
                headers = {'Authorization': f'Bearer {openai_key}', 'Content-Type': 'application/json'}
                payload = {
                    'model': 'gpt-3.5-turbo',
                    'messages': [{'role': 'user', 'content': message}],
                    'max_tokens': 150
                }
                res = requests.post('https://api.openai.com/v1/chat/completions', json=payload, headers=headers, timeout=5)
                if res.status_code == 200:
                    answer = res.json()['choices'][0]['message']['content']
                    return Response({'response': answer})
            except Exception:
                pass

        # 4. Default Fallback
        return Response({
            'response': "I am your AI Shopping Assistant! I can help you find products, track active orders, answer return policies, or apply discount coupons. How can I assist you today?"
        })
