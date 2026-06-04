from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "id",
            "customer_name",
            "phone_number",
            "email",
            "address",
            "city",
            "pincode",
            "payment_method",
            "items",
            "total_price",
            "status",
            "created_at",
            "delivery_fee",
            "tip_amount",
            "customer_rating",
            "customer_feedback",
        ]