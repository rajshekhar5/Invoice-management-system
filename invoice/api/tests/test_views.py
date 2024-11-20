import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from .models import Invoice, InvoiceDetail

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def sample_invoice():
    invoice = Invoice.objects.create(invoice_number="INV001", customer_name="John Doe", date="2024-11-12")
    InvoiceDetail.objects.create(invoice=invoice, description="Product A", quantity=2, unit_price=50)
    return invoice

def test_create_invoice(api_client):
    payload = {
        "invoice_number": "INV002",
        "customer_name": "Jane Doe",
        "date": "2024-11-20",
        "details": [
            {"description": "Product X", "quantity": 1, "unit_price": 100.00},
            {"description": "Product Y", "quantity": 2, "unit_price": 50.00}
        ]
    }
    response = api_client.post(reverse('invoice-list'), payload, format='json')
    assert response.status_code == 201
    assert response.data['invoice_number'] == "INV002"

def test_update_invoice(api_client, sample_invoice):
    url = reverse('invoice-detail', args=[sample_invoice.id])
    payload = {
        "customer_name": "Updated Name",
    }
    response = api_client.patch(url, payload, format='json')
    assert response.status_code == 200
    assert response.data['customer_name'] == "Updated Name"

def test_delete_invoice(api_client, sample_invoice):
    url = reverse('invoice-detail', args=[sample_invoice.id])
    response = api_client.delete(url)
    assert response.status_code == 204
