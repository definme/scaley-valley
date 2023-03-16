from django.contrib import admin
from .models import Resource, Chain, Kind, Valley, Character


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    pass


@admin.register(Chain)
class ChainAdmin(admin.ModelAdmin):
    pass


@admin.register(Kind)
class KindAdmin(admin.ModelAdmin):
    pass


@admin.register(Valley)
class ValleyAdmin(admin.ModelAdmin):
    pass


@admin.register(Character)
class CharacterAdmin(admin.ModelAdmin):
    list_display = ('contract_token_id', 'owner',
                    'price', 'valley', 'creation_time', 'last_update')
    search_fields = ('kind__name', 'contract_token_id', 'owner', 'valley__name')
