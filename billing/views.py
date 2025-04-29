from django.http import HttpResponse
from reportlab.pdfgen import canvas
from io import BytesIO
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from orders.models import Order
from .serializers import OrderSerializer
from datetime import  timedelta
from django.utils import timezone
import matplotlib
import io
import base64
import seaborn as sns

matplotlib.use('Agg')
import matplotlib.pyplot as plt
# Function to generate a PDF receipt
def generate_receipt(order):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer)

    # Add content to the PDF
    pdf.drawString(100, 800, f"Receipt for Order #{order.id}")
    pdf.drawString(100, 780, f"Customer: {order.customer_name}")
    pdf.drawString(100, 760, f"Order Date: {order.order_date}")

    y = 740
    pdf.drawString(100, y, "Items:")
    y -= 20

    for item in order.items.all():
        pdf.drawString(120, y, f"{item.quantity} x {item.product.name} - Rs{item.total_price}")
        y -= 20

    pdf.drawString(100, y - 20, f"Total Price: Rs{order.total_price}")
    pdf.save()

    buffer.seek(0)
    return buffer

# View to download a receipt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_receipt(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
        buffer = generate_receipt(order)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="receipt_{order.id}.pdf"'
        return response
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

# View to fetch order history
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_history(request):
    orders = Order.objects.filter(user=request.user).order_by('-order_date')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

# View to generate sales analytics
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_analytics(request):
    # Define time range
    end_date = timezone.now()
    start_date = end_date - timedelta(days=30)

    # Get orders in date range
    orders = Order.objects.filter(order_date__range=[start_date, end_date])

    # Prepare daily sales data
    daily_sales = {}
    for order in orders:
        date = order.order_date.strftime('%Y-%m-%d')
        daily_sales[date] = daily_sales.get(date, 0) + order.total_price

    # Sort the dates
    dates = sorted(daily_sales.keys())
    sales = [daily_sales[date] for date in dates]

    # Apply Seaborn style
    sns.set_style("whitegrid")

    # Create plot
    fig, ax = plt.subplots(figsize=(12, 6))
    bars = ax.bar(dates, sales, color=sns.color_palette("Blues", len(dates)))

    # Format plot
    ax.set_title('Sales Over the Last 30 Days', fontsize=16)
    ax.set_xlabel('Date', fontsize=12)
    ax.set_ylabel('Sales (Rs)', fontsize=12)
    ax.set_xticklabels(dates, rotation=45, ha='right')
    ax.margins(x=0.01)
    plt.tight_layout()

    # Save to buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', dpi=150)
    buffer.seek(0)
    plt.close()

    # Encode to base64
    chart_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    return Response({"chart": chart_base64})