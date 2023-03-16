from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer
from .models import Resource, Chain, Kind, Valley, Character


class ValleySerializer(ModelSerializer):
    chain_name = SerializerMethodField()

    class Meta:
        fields = ('name', 'image_uri', 'description', 'chain', 'chain_name')
        model = Valley

    def get_chain_name(self, valley: Valley):
        return valley.chain.name


class ChainSerializer(ModelSerializer):
    class Meta:
        fields = ('name', 'chain_id', 'rpc_url')
        model = Chain


class ResourceSerializer(ModelSerializer):
    chain_name = SerializerMethodField()

    class Meta:
        fields = (
            'name', 'chain', 'chain_name', 'resource_token_address', 'trade_contract_address', 'resource_token_name')
        model = Resource

    def get_chain_name(self, resource: Resource):
        return resource.chain.name


class KindSerializer(ModelSerializer):
    resource = ResourceSerializer(many=False, read_only=True)

    class Meta:
        fields = ('name', 'contract_kind_id', 'resource', 'image_uri')
        model = Kind


class CharacterSerializer(ModelSerializer):
    valley = ValleySerializer(many=False, read_only=True)
    kind = KindSerializer(many=False, read_only=True)
    image_uri = SerializerMethodField()

    class Meta:
        fields = (
            'kind', 'image_uri', 'contract_token_id', 'owner', 'price', 'level', 'agility', 'intellect',
            'valley', 'creation_time', 'last_update')
        model = Character

    def get_image_uri(self, character: Character):
        return character.kind.image_uri
