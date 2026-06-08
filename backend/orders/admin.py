from django.contrib import admin
from .models import Order, SupportRequest


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer_name",
        "phone_number",
        "payment_method",
        "total_price",
        "status",
        "created_at",
    )
    list_filter = ("status", "payment_method", "created_at")
    search_fields = ("customer_name", "phone_number", "email", "city")


@admin.register(SupportRequest)
class SupportRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "phone",
        "order_id",
        "issue_type",
        "status",
        "created_at",
    )
    list_filter = ("issue_type", "status", "created_at")
    search_fields = ("name", "phone", "order_id", "message")