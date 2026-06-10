from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status as drf_status

from .models import Order, SupportRequest
from .serializers import OrderSerializer, SupportRequestSerializer


@api_view(["GET", "POST"])
def order_list(request):
    if request.method == "POST":
        serializer = OrderSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=drf_status.HTTP_201_CREATED)

        return Response(serializer.errors, status=drf_status.HTTP_400_BAD_REQUEST)

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

    if request.method == "GET":
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=drf_status.HTTP_200_OK)

    if request.method in ["PATCH", "PUT"]:
        serializer = OrderSerializer(order, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=drf_status.HTTP_200_OK)

        return Response(serializer.errors, status=drf_status.HTTP_400_BAD_REQUEST)

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

    customer_rating = request.data.get("customer_rating", None)
    customer_feedback = request.data.get("customer_feedback", "")

    if customer_rating is not None:
        order.customer_rating = customer_rating

    order.customer_feedback = customer_feedback
    order.save()

    serializer = OrderSerializer(order)
    return Response(serializer.data, status=drf_status.HTTP_200_OK)


@api_view(["GET", "POST"])
def support_request_list(request):
    if request.method == "POST":
        serializer = SupportRequestSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=drf_status.HTTP_201_CREATED)

        return Response(serializer.errors, status=drf_status.HTTP_400_BAD_REQUEST)

    phone = request.GET.get("phone")

    if phone:
        support_requests = SupportRequest.objects.filter(phone=phone).order_by("-id")
    else:
        support_requests = SupportRequest.objects.all().order_by("-id")

    serializer = SupportRequestSerializer(support_requests, many=True)
    return Response(serializer.data, status=drf_status.HTTP_200_OK)
@api_view(["PATCH", "PUT"])
def update_support_status(request, support_id):
    try:
        support_request = SupportRequest.objects.get(id=support_id)
    except SupportRequest.DoesNotExist:
        return Response(
            {"error": "Support request not found"},
            status=drf_status.HTTP_404_NOT_FOUND,
        )

    new_status = request.data.get("status")

    if not new_status:
        return Response(
            {"error": "Status is required"},
            status=drf_status.HTTP_400_BAD_REQUEST,
        )

    support_request.status = new_status
    support_request.save()

    serializer = SupportRequestSerializer(support_request)
    return Response(serializer.data, status=drf_status.HTTP_200_OK)