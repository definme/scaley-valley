# Generated by Django 4.1.7 on 2023-03-20 07:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scaley_valley', '0009_rename_resource_token_address_resource_spendable_resource_token_address'),
    ]

    operations = [
        migrations.AddField(
            model_name='resource',
            name='buyable_resource_token_address',
            field=models.CharField(blank=True, max_length=42, null=True),
        ),
    ]
