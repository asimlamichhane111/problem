from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product
from .serializers import ProductSerializer
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def product_list(request):
    category=request.GET.get("category")
    if category:
        products=Product.objects.filter(category__name=category)
    else:
        products=Product.objects.all()
    serializer=ProductSerializer(products,many=True)
    return Response(serializer.data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def low_stock_products(request):
    low_stock_threshold = 5  
    low_stock_items = Product.objects.filter(quantity__lt=low_stock_threshold)  
    
    serializer = ProductSerializer(low_stock_items, many=True)
    return Response(serializer.data)
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def add_to_inventory(request, product_id):
#     try:
#         product = Product.objects.get(id=product_id)
#         product.quantity += 1
#         product.save()
#         return Response({"message": "Product added to inventory successfully!"}, status=200)
#     except Product.DoesNotExist:
#         return Response({"error": "Product not found"}, status=404)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def top_selling_products(request):
    try:
        # Get top 5 selling products based on quantity_sold
        top_products = Product.objects.filter(quantity_sold__gt=0).order_by('-quantity_sold')[:5]
        
        # Serialize the data with proper image URLs
        products_data = []
        for product in top_products:
            product_data = {
                'id': product.id,
                'name': product.name,
                'price': str(product.price),  # Convert Decimal to string
                'quantity_sold': product.quantity_sold,
                'image': request.build_absolute_uri(product.image.url) if product.image else None
            }
            products_data.append(product_data)
        
        return Response(products_data)
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)