from django.db import models


class Order(models.Model):
    customer_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(default="")
    address = models.TextField()
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    payment_method = models.CharField(
        
        max_length=50,
        default="Cash on Delivery"
    )
    

    items = models.TextField()
    total_price = models.IntegerField()
    delivery_fee = models.IntegerField(default=0)
    tip_amount = models.IntegerField(default=0)

    status = models.CharField(max_length=50, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)

    
    customer_rating = models.IntegerField(null=True, blank=True)
    customer_feedback = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.customer_name
    
from django.db import models


class Order(models.Model):
    customer_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    payment_method = models.CharField(max_length=50)
    items = models.TextField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tip_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    status = models.CharField(max_length=50, default="Pending")

    customer_rating = models.IntegerField(blank=True, null=True)
    customer_feedback = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"


class SupportRequest(models.Model):
    ISSUE_CHOICES = [
        ("Order Issue", "Order Issue"),
        ("Delivery Issue", "Delivery Issue"),
        ("Payment Issue", "Payment Issue"),
        ("Product Quality Issue", "Product Quality Issue"),
        ("Cancel Order", "Cancel Order"),
        ("Other", "Other"),
    ]

    STATUS_CHOICES = [
        ("New", "New"),
        ("In Progress", "In Progress"),
        ("Resolved", "Resolved"),
    ]

    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    order_id = models.CharField(max_length=20, blank=True, null=True)
    issue_type = models.CharField(max_length=50, choices=ISSUE_CHOICES)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="New")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Support #{self.id} - {self.name} - {self.issue_type}"