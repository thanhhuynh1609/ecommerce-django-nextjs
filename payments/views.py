from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from django.conf import settings
from orders.models import Order
from .vnpay import VNPay


class VNPayCreatePayment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("order_id")

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except:
            return Response({"error": "Order not found"}, status=404)

        total_amount = int((order.total_price + order.shipping_fee) * 100)

        vnp = VNPay()
        vnp.requestData['vnp_Version'] = '2.1.0'
        vnp.requestData['vnp_Command'] = 'pay'
        vnp.requestData['vnp_TmnCode'] = settings.VNPAY_TMN_CODE
        vnp.requestData['vnp_Amount'] = total_amount
        vnp.requestData['vnp_CurrCode'] = 'VND'
        vnp.requestData['vnp_TxnRef'] = str(order.id)
        vnp.requestData['vnp_OrderInfo'] = f"Thanh toan don hang {order.id}"
        vnp.requestData['vnp_OrderType'] = "other"
        vnp.requestData['vnp_Locale'] = 'vn'
        vnp.requestData['vnp_ReturnUrl'] = settings.VNPAY_RETURN_URL
        vnp.requestData['vnp_IpAddr'] = request.META.get('REMOTE_ADDR')
        vnp.requestData['vnp_CreateDate'] = datetime.now().strftime('%Y%m%d%H%M%S')

        payment_url = vnp.get_payment_url(
            settings.VNPAY_PAYMENT_URL,
            settings.VNPAY_HASH_SECRET
        )

        return Response({
            "payment_url": payment_url
        })

class VNPayReturnView(APIView):
    def get(self, request):
        vnp_data = request.GET.dict()

        vnp = VNPay()
        vnp.responseData = vnp_data.copy()

        if not vnp.validate_response(settings.VNPAY_HASH_SECRET):
            return Response({"error": "Invalid signature"}, status=400)

        order_id = vnp_data.get("vnp_TxnRef")
        response_code = vnp_data.get("vnp_ResponseCode")

        try:
            order = Order.objects.get(id=order_id)
        except:
            return Response({"error": "Order not found"}, 404)

        if response_code == "00":
            order.status = "COMPLETED"
            order.save()
            return Response({"message": "Payment success", "order_id": order_id})

        return Response({"message": "Payment failed", "code": response_code})
