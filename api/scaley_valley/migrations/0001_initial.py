# Generated by Django 4.1.7 on 2023-03-17 06:40

from django.conf import settings
import django.contrib.auth.validators
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import scaley_valley.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('address', models.CharField(blank=True, max_length=255, null=True, unique=True)),
                ('username', models.CharField(blank=True, error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, null=True, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('email', models.EmailField(blank=True, max_length=254, null=True, unique=True, validators=[django.core.validators.EmailValidator])),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'ordering': ['username'],
            },
            managers=[
                ('objects', scaley_valley.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Chain',
            fields=[
                ('name', models.CharField(max_length=255)),
                ('chain_id', models.IntegerField(primary_key=True, serialize=False)),
                ('rpc_url', models.CharField(max_length=255)),
                ('explorer', models.CharField(blank=True, max_length=255, null=True)),
                ('image_uri', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Valley',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('image_uri', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('chain', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='valley_chain', to='scaley_valley.chain')),
            ],
        ),
        migrations.CreateModel(
            name='Resource',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('resource_token_address', models.CharField(max_length=42)),
                ('trade_contract_address', models.CharField(max_length=42)),
                ('resource_token_name', models.CharField(max_length=5)),
                ('image_uri', models.CharField(max_length=255)),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('chain', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='resource_chain', to='scaley_valley.chain')),
            ],
        ),
        migrations.CreateModel(
            name='Kind',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('contract_kind_id', models.DecimalField(decimal_places=0, max_digits=80)),
                ('image_uri', models.CharField(max_length=255)),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('payment_resource', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='kind', to='scaley_valley.resource')),
            ],
        ),
        migrations.CreateModel(
            name='Character',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contract_token_id', models.DecimalField(decimal_places=0, max_digits=80)),
                ('price', models.DecimalField(decimal_places=0, max_digits=256)),
                ('level', models.IntegerField(default=1)),
                ('agility', models.IntegerField(default=1)),
                ('intellect', models.IntegerField(default=1)),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('kind', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='character', to='scaley_valley.kind')),
                ('owner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='owner', to=settings.AUTH_USER_MODEL)),
                ('valley', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='char_valley', to='scaley_valley.valley')),
            ],
        ),
    ]
