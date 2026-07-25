from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class AccountModelTests(TestCase):
    def test_create_customer_user(self):
        user = User.objects.create_user(
            email='customer@example.com',
            password='Password123!',
            first_name='John',
            last_name='Doe'
        )
        self.assertEqual(user.email, 'customer@example.com')
        self.assertEqual(user.role, 'CUSTOMER')
        self.assertTrue(user.check_password('Password123!'))

    def test_create_superuser(self):
        admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='AdminPassword123!',
            first_name='Admin',
            last_name='User'
        )
        self.assertEqual(admin_user.email, 'admin@example.com')
        self.assertEqual(admin_user.role, 'ADMIN')
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.is_staff)
