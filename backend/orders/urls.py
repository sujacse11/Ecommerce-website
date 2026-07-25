from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, WishlistViewSet, CouponViewSet

router = DefaultRouter()
router.register('coupons', CouponViewSet, basename='coupon')
router.register('wishlist', WishlistViewSet, basename='wishlist')
router.register('', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
]
