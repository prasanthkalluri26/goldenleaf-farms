from django.urls import path
from .views import order_list, order_detail, update_order_status, update_feedback

urlpatterns = [
    path("orders/", order_list, name="order-list"),
    path("orders/<int:order_id>/", order_detail, name="order-detail"),
    path("orders/<int:order_id>/status/", update_order_status, name="update-order-status"),
    path("orders/<int:order_id>/feedback/", update_feedback, name="update-feedback"),
]