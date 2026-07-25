from django.test import TestCase
from django.contrib.auth import get_user_model
from products.models import Category, Brand, Product

User = get_user_model()

class ProductModelTests(TestCase):
    def setUp(self):
        self.seller = User.objects.create_user(
            email='seller@example.com',
            password='Password123!',
            role='SELLER'
        )
        self.category = Category.objects.create(name='Electronics')
        self.brand = Brand.objects.create(name='TechCorp')

    def test_create_product(self):
        product = Product.objects.create(
            seller=self.seller,
            category=self.category,
            brand=self.brand,
            title='Smartphone X',
            description='Latest flagship smartphone',
            price=999.99,
            sku='TECH-SMX-001'
        )
        self.assertEqual(product.title, 'Smartphone X')
        self.assertTrue(product.slug.startswith('smartphone-x'))
        self.assertEqual(product.current_price, 999.99)
