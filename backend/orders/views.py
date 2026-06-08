from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status as drf_status

from .models import Order
from .serializers import OrderSerializer


@api_view(["GET", "POST"])
def order_list(request):
    # CREATE ORDER
    if request.method == "POST":
        serializer = OrderSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=drf_status.HTTP_201_CREATED)

        return Response(serializer.errors, status=drf_status.HTTP_400_BAD_REQUEST)

    # GET ORDERS
    phone_number = request.GET.get("phone_number")

    if phone_number:
        orders = Order.objects.filter(phone_number=phone_number).order_by("-id")
    else:
        orders = Order.objects.all().order_by("-id")

    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=drf_status.HTTP_200_OK)


@api_view(["GET", "PATCH", "PUT", "DELETE"])
def order_detail(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response(
            {"error": "Order not found"},
            status=drf_status.HTTP_404_NOT_FOUND,
        )

    # GET SINGLE ORDER
    if request.method == "GET":
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=drf_status.HTTP_200_OK)

    # UPDATE ORDER / STATUS
    if request.method in ["PATCH", "PUT"]:
        serializer = OrderSerializer(order, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=drf_status.HTTP_200_OK)

        return Response(serializer.errors, status=drf_status.HTTP_400_BAD_REQUEST)

    # DELETE ORDER
    if request.method == "DELETE":
        order.delete()
        return Response(
            {"message": "Order deleted successfully"},
            status=drf_status.HTTP_200_OK,
        )


@api_view(["PATCH", "PUT"])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response(
            {"error": "Order not found"},
            status=drf_status.HTTP_404_NOT_FOUND,
        )

    new_status = request.data.get("status")

    if not new_status:
        return Response(
            {"error": "Status is required"},
            status=drf_status.HTTP_400_BAD_REQUEST,
        )

    order.status = new_status
    order.save()

    serializer = OrderSerializer(order)
    return Response(serializer.data, status=drf_status.HTTP_200_OK)


@api_view(["PATCH", "PUT"])
def update_feedback(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response(
            {"error": "Order not found"},
            status=drf_status.HTTP_404_NOT_FOUND,
        )

    # Your frontend sends customer_rating and customer_feedback
    customer_rating = request.data.get("customer_rating", None)
    customer_feedback = request.data.get("customer_feedback", "")

    if hasattr(order, "customer_rating") and customer_rating is not None:
        order.customer_rating = customer_rating

    if hasattr(order, "customer_feedback"):
        order.customer_feedback = customer_feedback

    order.save()

    serializer = OrderSerializer(order)
    return Response(serializer.data, status=drf_status.HTTP_200_OK)