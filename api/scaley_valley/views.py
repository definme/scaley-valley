import json

from django.forms import model_to_dict
from django.http import HttpResponse, JsonResponse
from rest_framework import permissions, viewsets, views, renderers
from rest_framework.request import Request
from rest_framework.response import Response
from django_filters import FilterSet, CharFilter, rest_framework
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK

from .serializer import ValleySerializer, ChainSerializer, ResourceSerializer, CharacterSerializer, KindSerializer, \
    NFTMintRequestSerializer
from .models import Resource, Chain, Kind, Valley, Character, NFTMintRequest, GnosisBridgeProcess


class ChainViewSet(viewsets.ModelViewSet):
    queryset = Chain.objects.all()
    serializer_class = ChainSerializer


class ValleyViewSet(viewsets.ModelViewSet):
    queryset = Valley.objects.all()
    serializer_class = ValleySerializer


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer


class KindViewSet(viewsets.ModelViewSet):
    queryset = Kind.objects.all()
    serializer_class = KindSerializer


class CharacterFilter(FilterSet):
    owner = CharFilter(field_name='owner__address')
    contract_kind_id = CharFilter(field_name='kind__contract_kind_id')
    contract_token_id = CharFilter(field_name='contract_token_id')

class CharacterViewSet(viewsets.ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    filter_backends = [rest_framework.DjangoFilterBackend]
    filterset_class = CharacterFilter


class NFTMintRequestFilter(FilterSet):
    purchase_tx_hash = CharFilter(field_name='purchase_tx_hash')


class NFTMintRequestViewSet(viewsets.ModelViewSet):
    queryset = NFTMintRequest.objects.all()
    serializer_class = NFTMintRequestSerializer
    filter_backends = [rest_framework.DjangoFilterBackend]
    filterset_class = NFTMintRequestFilter


class MetadataView(views.APIView):
    renderer_classes = [renderers.JSONRenderer]
    queryset = Kind.objects.all()
    http_method_names = ['get', 'options', 'head']

    def get(self, request, *args, **kwargs):
        default_meta = {
            0x0000: 'aquatique.json',
            0x0001: 'druid.json',
            0x0002: 'illuminator.json',
            0x0003: 'hermes.json',
        }
        token_id = self.kwargs.get('contract_token_id', None)
        if len(token_id) < 60:
            int_token_id = int(token_id)
        else:
            int_token_id = int(token_id, 16)

        token_kind = (0xffff0000 & int_token_id) >> 16
        json_path = f'scaley_valley/metadata/{default_meta[token_kind]}'

        with open(json_path) as json_file:
            data = json.load(json_file)

        return Response(data)


class GnosisBridgeProcessView(views.APIView):
    http_method_names = ["get", "post", "options", "head"]

    def post(self, request) -> HttpResponse:
        if tx := request.data.get("tx"):
            process, _ = GnosisBridgeProcess.objects.get_or_create(purchase_tx_hash=tx)

            return_data = {'purchaseTxHash': process.purchase_tx_hash}
            response = JsonResponse(data=return_data, status=HTTP_200_OK)
            return response
        else:
            return HttpResponse("No tx provided", status=HTTP_400_BAD_REQUEST)

    def get(self, request: Request) -> HttpResponse:
        tx = request.query_params.get('tx')
        process = GnosisBridgeProcess.objects.filter(purchase_tx_hash=tx).first()
        if not process:
            return JsonResponse(data={"message": "Bad request"}, status=HTTP_400_BAD_REQUEST)
        return_data = model_to_dict(process)
        response = JsonResponse(data=return_data, status=HTTP_200_OK)
        return response