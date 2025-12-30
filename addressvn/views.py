from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Province, Ward
from .serializers import ProvinceSerializer, WardSerializer

class ProvinceListView(APIView):
    def get(self, request):
        provinces = Province.objects.all().order_by("name")
        return Response(ProvinceSerializer(provinces, many=True).data)


class WardByProvinceView(APIView):
    def get(self, request, province_id):
        wards = Ward.objects.filter(province_id=province_id).order_by("name")
        return Response(WardSerializer(wards, many=True).data)
