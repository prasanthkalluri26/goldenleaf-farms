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
    