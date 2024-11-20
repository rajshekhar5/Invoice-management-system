from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from .models import Invoice, InvoiceDetail
from .serializers import InvoiceSerializer, InvoiceDetailSerializer
from django.db import transaction
from decimal import Decimal

class InvoicePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class InvoiceAPIView(APIView):
    pagination_class = InvoicePagination

    def get(self, request):
        invoices = Invoice.objects.prefetch_related('details').all()
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(invoices, request)
        serializer = InvoiceSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    @transaction.atomic
    def post(self, request):
        data = request.data
        details_data = data.pop('details', [])

        serializer = InvoiceSerializer(data=data)
        if serializer.is_valid():
            invoice = serializer.save()

            for detail in details_data:
                detail['invoice'] = invoice.id
                detail_serializer = InvoiceDetailSerializer(data=detail)
                if detail_serializer.is_valid():
                    detail_serializer.save()
                else:
                    return Response(detail_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            total_amount = sum(d['quantity'] * d['unit_price'] for d in details_data)
            invoice.total_amount = total_amount
            invoice.save()

            return Response(InvoiceSerializer(invoice).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @transaction.atomic
    def put(self, request, pk):
        try:
            invoice = Invoice.objects.get(pk=pk)
            data = request.data
            details_data = data.pop('details', [])
            
            serializer = InvoiceSerializer(invoice, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            total_amount = 0
            for detail in details_data:
                detail['quantity'] = int(detail['quantity'])  # Ensure integer
                detail['unit_price'] = Decimal(detail['unit_price'])  # Ensure decimal
                detail['line_total'] = detail['quantity'] * detail['unit_price']

                InvoiceDetail.objects.update_or_create(
                    invoice=invoice,  # Pass the Invoice instance here
                    description=detail['description'],
                    defaults={
                        'quantity': detail['quantity'],
                        'unit_price': detail['unit_price'],
                        'line_total': detail['line_total'],
                    }
                )

            
            invoice.total_amount = total_amount
            invoice.save()

            return Response({"message": "Invoice updated successfully"}, status=200)
        except Invoice.DoesNotExist:
            return Response({"error": "Invoice not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)



    def delete(self, request, pk):
        try:
            invoice = Invoice.objects.get(pk=pk)
            invoice.delete()
            return Response({'message': 'Invoice deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Invoice.DoesNotExist:
            return Response({'error': 'Invoice not found'}, status=status.HTTP_404_NOT_FOUND)
