from django.contrib import admin
from .models import Cart

class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'quantity', 'total_price')
    
    list_filter = ('user', 'product')
    
    search_fields = ('user__username', 'product__name')
    
    readonly_fields = ('total_price',)
    
    def total_price(self, obj):
        return obj.total_price()
    total_price.short_description = 'Total Price'  


admin.site.register(Cart, CartAdmin)
