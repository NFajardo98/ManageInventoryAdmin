import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/orderItems/OrderItemsColums";
import Delete from "@/components/custom ui/Delete";
import CompleteOrder from "@/components/custom ui/CompleteOrder";

const OrderDetails = async ({ params }: { params: Promise<{ orderId: string }> }) => {
  const { orderId } = await params; // Usa `await` para desestructurar `params`

  const res = await fetch(`${process.env.ADMIN_DASHBOARD_URL}/api/orders/${orderId}`);
  const { orderDetails } = await res.json();

  return (
    <div className="flex flex-col p-10 gap-5">
      <div className="flex items-center justify-between">
        <p className="text-base-bold">
          Order ID: <span className="text-base-medium">{orderDetails._id}</span>
        </p>
      </div>
      <p className="text-base-bold">
        Total Paid: <span className="text-base-medium">${orderDetails.totalAmount}</span>
      </p>
      <DataTable columns={columns} data={orderDetails.products} searchKey="_id" />
    </div>
  );
};


export default OrderDetails;