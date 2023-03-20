from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer
from .models import Resource, Chain, Kind, Valley, Character, NFTMintRequest


class ChainSerializer(ModelSerializer):
    class Meta:
        fields = ('name', 'chain_id', 'rpc_url', 'explorer', 'image_uri')
        model = Chain


class ValleySerializer(ModelSerializer):
    chain_name = ChainSerializer(many=False, read_only=True)
    bridge_contract = SerializerMethodField()

    class Meta:
        fields = ('name', 'image_uri', 'description', 'chain', 'chain_name', 'bridge_contract')
        model = Valley

    def get_chain_name(self, valley: Valley):
        return valley.chain.name

    def get_bridge_contract(self, valley: Valley):
        if valley.collateral_address:
            return valley.collateral_address
        else:
            return valley.collection_address


class ResourceSerializer(ModelSerializer):
    spend_resource_chain = ChainSerializer(many=False, read_only=True)
    buy_resource_chain = ChainSerializer(many=False, read_only=True)

    class Meta:
        fields = (
            'name', 'price', 'spend_resource_chain', 'buy_resource_chain', 'spendable_resource_token_address',
            'buyable_resource_token_address',
            'trade_contract_address', 'resource_token_name', 'image_uri')
        model = Resource


class KindSerializer(ModelSerializer):
    payment_resource = ResourceSerializer(many=False, read_only=True)

    class Meta:
        fields = ('name', 'contract_kind_id', 'image_uri', 'payment_resource')
        model = Kind


class CharacterSerializer(ModelSerializer):
    valley = ValleySerializer(many=False, read_only=True)
    kind = KindSerializer(many=False, read_only=True)

    class Meta:
        fields = (
            'kind', 'contract_token_id', 'owner', 'price', 'level', 'agility', 'intellect',
            'valley', 'creation_time', 'last_update')
        model = Character


class NFTMintRequestSerializer(ModelSerializer):
    class Meta:
        fields = ('kind', 'recipient', 'price', 'nft_id', 'mint_tx_hash', 'purchase_tx_hash', 'status')
        model = NFTMintRequest
