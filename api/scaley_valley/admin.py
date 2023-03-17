from django.contrib import admin
from .models import User, Resource, Chain, Kind, Valley, Character


class CharacterInLine(admin.TabularInline):
    model = Character

    def get_extra(self, request, obj=None, **kwargs):
        return 0


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    inlines = [CharacterInLine]
    search_fields = ('username', 'address', 'email')


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
