from django.contrib.auth.models import User
from django.db.models import Model, IntegerField, CharField, DecimalField, ForeignKey, SET_NULL, CASCADE, TextField, \
    DateTimeField


class Chain(Model):
    name = CharField(max_length=255)
    chain_id = IntegerField(primary_key=True)
    rpc_url = CharField(max_length=255)

    def __str__(self):
        return f'{self.name}({self.chain_id})'


class Resource(Model):
    name = CharField(max_length=255)
    chain = ForeignKey(Chain, related_name='resource_chain', on_delete=CASCADE)
    resource_token_address = CharField(max_length=42)
    trade_contract_address = CharField(max_length=42)
    resource_token_name = CharField(max_length=5)
    image_uri = CharField(max_length=255)
    creation_time = DateTimeField(auto_now_add=True)
    last_update = DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name}({self.resource_token_name})'


class Valley(Model):
    name = CharField(max_length=255)
    chain = ForeignKey(Chain, related_name='valley_chain', on_delete=CASCADE)
    image_uri = CharField(max_length=255)
    description = TextField(blank=True, null=True)
    creation_time = DateTimeField(auto_now_add=True)
    last_update = DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name}({self.chain})'


class Kind(Model):
    name = CharField(max_length=255, unique=True)
    contract_kind_id = DecimalField(max_digits=80, decimal_places=0)
    payment_resource = ForeignKey(Resource, related_name='kind', on_delete=SET_NULL, blank=True, null=True)
    image_uri = CharField(max_length=255)
    creation_time = DateTimeField(auto_now_add=True)
    last_update = DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name}(kind: {self.contract_kind_id})'


class Character(Model):
    kind = ForeignKey(Kind, related_name='character', on_delete=CASCADE)
    contract_token_id = DecimalField(max_digits=80, decimal_places=0)
    owner = ForeignKey(User, related_name='owner', on_delete=SET_NULL, blank=True, null=True)
    price = DecimalField(max_digits=256, decimal_places=0)
    level = IntegerField(default=1)
    agility = IntegerField(default=1)
    intellect = IntegerField(default=1)
    valley = ForeignKey(Valley, related_name='char_valley', on_delete=SET_NULL, blank=True, null=True)
    creation_time = DateTimeField(auto_now_add=True)
    last_update = DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.contract_token_id}'
