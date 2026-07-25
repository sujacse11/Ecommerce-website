from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ('id', 'user', 'user_name', 'product', 'rating', 'comment', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.email
