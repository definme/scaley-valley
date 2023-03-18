from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import UnicodeUsernameValidator, AbstractBaseUser, PermissionsMixin
from django.core.validators import EmailValidator
from django.db.models import Model, IntegerField, CharField, DecimalField, ForeignKey, SET_NULL, CASCADE, TextField, \
    DateTimeField, EmailField, BooleanField, TextChoices, PositiveBigIntegerField
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, address, email, **extra_fields):
        """
        Create and save a user with the given username, address and password.
        """
        if not address:
            raise ValueError('The given address must be set')
        user = self.model(address=address, email=email, **extra_fields)
        user.save(using=self._db)
        return user

    def _create_super_user(self, password, username, **extra_fields):
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, address, email=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(address, email, **extra_fields)

    def create_superuser(self, password, username=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_super_user(password, username, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    username_validator = UnicodeUsernameValidator()
    address = CharField(max_length=255, unique=True, blank=True, null=True)
    username = CharField(
        _('username'),
        max_length=150,
        unique=True,
        null=True,
        blank=True,
        help_text=_('Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        validators=[username_validator],
        error_messages={
            'unique': _("A user with that username already exists."),
        },
    )
    email = EmailField(max_length=254, unique=True, null=True, blank=True, validators=[EmailValidator])

    class Meta:
        ordering = ['username']

    is_active = BooleanField(default=True)
    is_staff = BooleanField(default=False)

    USERNAME_FIELD = 'username'

    objects = UserManager()

    def __str__(self):
        if self.email:
            return str(self.email)
        if self.address:
            return f"Created by indexer: {self.address}"
        if self.username:
            return f"Staff: {self.username}"

    def get_short_name(self):
        return self.username

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = None
        if not self.address:
            self.address = None
        super().save(*args, **kwargs)


class Chain(Model):
    name = CharField(max_length=255)
    chain_id = IntegerField(primary_key=True)
    rpc_url = CharField(max_length=255)
    explorer = CharField(max_length=255, blank=True, null=True)
    image_uri = CharField(max_length=255, blank=True, null=True)
    last_indexed_block = PositiveBigIntegerField(blank=True, null=True)
    indexed_blocks_interval = PositiveBigIntegerField(blank=True, null=True)

    def __str__(self):
        return f'{self.name}({self.chain_id})'


class Resource(Model):
    name = CharField(max_length=255)
    spend_resource_chain = ForeignKey(Chain, related_name='resource_chain', on_delete=CASCADE)
    buy_resource_chain = ForeignKey(Chain, related_name='buy_resource_chain', on_delete=CASCADE, null=True, blank=True)
    spendable_resource_token_address = CharField(max_length=42)
    buyable_resource_token_address = CharField(max_length=42, null=True, blank=True)
    trade_contract_address = CharField(max_length=42)
    resource_token_name = CharField(max_length=5)
    image_uri = CharField(max_length=255)
    creation_time = DateTimeField(auto_now_add=True)
    last_update = DateTimeField(auto_now=True)
    price = DecimalField(max_digits=256, decimal_places=0, default=0)

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
    contract_kind_id = DecimalField(max_digits=80, decimal_places=0, unique=True)
    payment_resource = ForeignKey(Resource, related_name='kind', on_delete=SET_NULL, blank=True, null=True)
    image_uri = CharField(max_length=255)
    supply = DecimalField(max_digits=80, decimal_places=0, default=0, blank=True)
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


class StatusChoices(TextChoices):
    NEW = ("NEW", _("New"))
    SUCCESS = ("SUCCESS", _("Success"))
    FAIL = ("FAIL", _("Fail"))
    APPLIED = ("APPLIED", _("Applied in TradeContract"))


class NFTMintRequest(Model):
    kind = ForeignKey(Kind, related_name='mint_requests', on_delete=CASCADE)
    recipient = CharField(max_length=42)
    price = DecimalField(max_digits=256, decimal_places=0)
    nft_id = DecimalField(max_digits=256, decimal_places=0, null=True, blank=True)
    mint_tx_hash = CharField(max_length=66, null=True, blank=True)
    purchase_tx_hash = CharField(max_length=66, unique=True)
    status = CharField(max_length=255, choices=StatusChoices.choices)

    def __str__(self) -> str:
        return f"Mint {self.kind.name} token to {self.recipient} bought on {self.purchase_tx_hash}"
