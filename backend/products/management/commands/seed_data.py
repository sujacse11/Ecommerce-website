from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Category, Brand, Product, Inventory
from orders.models import Coupon
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds database with initial categories, brands, products, coupons, and test accounts.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding initial data...')

        # 1. Users
        admin, _ = User.objects.get_or_create(
            email='admin@ecommerce.com',
            defaults={
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'ADMIN',
                'is_staff': True,
                'is_superuser': True,
                'is_email_verified': True
            }
        )
        if _:
            admin.set_password('Admin123!')
            admin.save()

        seller, _ = User.objects.get_or_create(
            email='seller@ecommerce.com',
            defaults={
                'first_name': 'TechStore',
                'last_name': 'Official',
                'role': 'SELLER',
                'is_email_verified': True
            }
        )
        if _:
            seller.set_password('Seller123!')
            seller.save()

        customer, _ = User.objects.get_or_create(
            email='customer@ecommerce.com',
            defaults={
                'first_name': 'John',
                'last_name': 'Doe',
                'role': 'CUSTOMER',
                'is_email_verified': True
            }
        )
        if _:
            customer.set_password('Customer123!')
            customer.save()

        # 2. Categories & Brands
        cat_elec, _ = Category.objects.get_or_create(name='Electronics', description='Gadgets & Hardware')
        cat_fash, _ = Category.objects.get_or_create(name='Fashion', description='Apparel & Accessories')
        cat_home, _ = Category.objects.get_or_create(name='Home & Living', description='Furniture & Decor')

        brand_apple, _ = Brand.objects.get_or_create(name='AuraTech', description='Premium tech design')
        brand_nike, _ = Brand.objects.get_or_create(name='UrbanStride', description='Modern street style')

        # 3. Products
        products_data = [
            {
                'title': 'AuraBook Pro 16" Laptop',
                'category': cat_elec,
                'brand': brand_apple,
                'price': 1999.99,
                'discount_price': 1849.99,
                'sku': 'AURA-LAP-16',
                'main_image': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
                'description': 'High-performance laptop with 16-core M-Processor, 32GB RAM, and liquid retina display.',
                'is_featured': True,
                'stock': 25
            },
            {
                'title': 'Wireless Noise-Canceling Headphones',
                'category': cat_elec,
                'brand': brand_apple,
                'price': 299.99,
                'discount_price': 249.99,
                'sku': 'AURA-HEAD-01',
                'main_image': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
                'description': 'Immersive acoustic experience with 40-hour battery life and spatial audio capability.',
                'is_featured': True,
                'stock': 50
            },
            {
                'title': 'Urban Minimalist Sneakers',
                'category': cat_fash,
                'brand': brand_nike,
                'price': 129.99,
                'sku': 'URBAN-SNK-02',
                'main_image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60',
                'description': 'Ultra-lightweight breathable sneakers crafted for daily performance and comfort.',
                'is_featured': False,
                'stock': 40
            },
            {
                'title': 'Ergonomic Smart Desk Lamp',
                'category': cat_home,
                'brand': brand_apple,
                'price': 89.99,
                'discount_price': 69.99,
                'sku': 'HOME-LMP-05',
                'main_image': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=60',
                'description': 'Dimmable LED lamp with wireless charging base and customizable color temperature.',
                'is_featured': True,
                'stock': 30
            }
        ]

        for pdata in products_data:
            stock_qty = pdata.pop('stock')
            prod, created = Product.objects.get_or_create(
                sku=pdata['sku'],
                defaults={**pdata, 'seller': seller}
            )
            Inventory.objects.update_or_create(product=prod, defaults={'stock_quantity': stock_qty})

        # 4. Coupons
        Coupon.objects.get_or_create(
            code='WELCOME10',
            defaults={
                'discount_percentage': 10,
                'valid_from': timezone.now() - timedelta(days=1),
                'valid_to': timezone.now() + timedelta(days=365),
                'active': True
            }
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database! Accounts created: admin@ecommerce.com / seller@ecommerce.com / customer@ecommerce.com'))
