from rest_framework import serializers
from .models import Invoice, InvoiceDetail

class InvoiceDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = InvoiceDetail
        fields = ['id', 'invoice', 'description', 'quantity', 'unit_price', 'line_total']
        read_only_fields = ['line_total']  


class InvoiceSerializer(serializers.ModelSerializer):
    details = InvoiceDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'customer_name', 'date', 'details']
