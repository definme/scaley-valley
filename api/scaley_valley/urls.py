from django.urls import include, path
from rest_framework import routers
from .views import ValleyViewSet, ChainViewSet, ResourceViewSet, KindViewSet, CharacterViewSet, NFTMintRequestViewSet

router = routers.DefaultRouter()
router.register(r'chains', ChainViewSet)
router.register(r'valleys', ValleyViewSet)
router.register(r'resources', ResourceViewSet)
router.register(r'kinds', KindViewSet)
router.register(r'characters', CharacterViewSet)
router.register(r'nft-mint-requests', NFTMintRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/', include('rest_framework.urls', namespace='rest_framework'))
]
