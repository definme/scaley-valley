# Generated by Django 4.1.7 on 2023-03-16 09:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Chain',
            fields=[
                ('name', models.CharField(max_length=255)),
                ('chain_id', models.IntegerField(primary_key=True, serialize=False)),
                ('rpc_url', models.CharField(max_length=255)),
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
                ('chain', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='resource_chain', to='scaley_valley.chain')),
            ],
        ),
        migrations.CreateModel(
            name='Kind',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('contract_kind_id', models.DecimalField(decimal_places=0, max_digits=80)),
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
                ('image_uri', models.CharField(max_length=255)),
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
