from django.db import models

class Invoice(models.Model):
    id = models.AutoField(primary_key=True)  
    invoice_number = models.CharField(max_length=255, unique=True)
    customer_name = models.CharField(max_length=255)  
    date = models.DateField() 

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.customer_name}"

class InvoiceDetail(models.Model):
    id = models.AutoField(primary_key=True) 
    invoice = models.ForeignKey(Invoice, related_name="details", on_delete=models.CASCADE)  
    description = models.CharField(max_length=255)  
    quantity = models.PositiveIntegerField()  
    unit_price = models.DecimalField(max_digits=10, decimal_places=2) 
    line_total = models.DecimalField(max_digits=10, decimal_places=2, editable=False) 

    def save(self, *args, **kwargs):
        self.line_total = self.quantity * self.unit_price 
        super().save(*args, **kwargs)  
        
    def __str__(self):
        return f"Detail for {self.invoice.invoice_number}: {self.description}"
