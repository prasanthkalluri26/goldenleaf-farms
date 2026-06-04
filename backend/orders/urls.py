from django.urls import path
from .views import order_list, delete_order, update_order_status, update_feedback

urlpatterns = [
    path('orders/', order_list),
    path('orders/<int:id>/', delete_order),
    path('orders/<int:id>/status/', update_order_status),
    path('orders/<int:id>/feedback/', update_feedback),
]