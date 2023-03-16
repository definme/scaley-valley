from django.contrib.auth.models import User
from rest_framework import permissions, viewsets

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


class CharacterViewSet(viewsets.ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
