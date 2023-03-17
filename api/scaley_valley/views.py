import json
from rest_framework import permissions, viewsets, views, renderers
from rest_framework.response import Response
from django_filters import FilterSet, CharFilter, rest_framework

from .serializer import ValleySerializer, ChainSerializer, ResourceSerializer, CharacterSerializer, KindSerializer
from .models import Resource, Chain, Kind, Valley, Character


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


class CharacterViewSet(viewsets.ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    filter_backends = [rest_framework.DjangoFilterBackend]
    filterset_class = CharacterFilter


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
