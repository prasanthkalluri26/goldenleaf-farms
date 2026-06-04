from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer


@api_view(['GET', 'POST'])
def order_list(request):

    if request.method == 'GET':
        orders = Order.objects.all().order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = OrderSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors)


@api_view(['DELETE'])
def delete_order(request, id):

    try:
        order = Order.objects.get(id=id)
        order.delete()

        return Response({
            "message": "Order deleted successfully"
        })

    except Order.DoesNotExist:

        return Response({
            "error": "Order not found"
        })
@api_view(['PATCH'])
def update_feedback(request, id):

    try:
        order = Order.objects.get(id=id)

        order.customer_rating = request.data.get(
            "customer_rating",
            order.customer_rating
        )

        order.customer_feedback = request.data.get(
            "customer_feedback",
            order.customer_feedback
        )

        order.save()

        serializer = OrderSerializer(order)

        return Response(serializer.data)

    except Order.DoesNotExist:

        return Response({
            "error": "Order not found"
        })

@api_view(['PATCH'])
def update_order_status(request, id):

    try:
        order = Order.objects.get(id=id)

        order.status = request.data.get(
            "status",
            order.status
        )

        order.save()

        serializer = OrderSerializer(order)

        return Response(serializer.data)

    except Order.DoesNotExist:

        return Response({
            "error": "Order not found"
        })