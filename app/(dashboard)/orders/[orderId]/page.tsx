import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/orderItems/OrderItemsColums";
import AcceptOrderButton from "@/components/custom ui/AcceptOrderButton";

const OrderDetails = async ({ params }: { params: Promise<{ orderId: string }> }) => {
  const { orderId } = await params;

  const res = await fetch(`${process.env.ADMIN_DASHBOARD_URL}/api/orders/${orderId}`);
  const { orderDetails } = await res.json();
  console.log("Order Details:", orderDetails);

  return (
    <div className="flex flex-col p-10 gap-5">
      <div className="flex items-center justify-between">
        <p className="text-4xl font-extrabold text-gray-800">
          Table: <span className="text-4xl font-semibold text-gray-600">{orderDetails.table}</span>
        </p>
        <AcceptOrderButton orderId={orderDetails._id} disabled={orderDetails.status === "completed"} />
      </div>
      <p className="text-4xl font-extrabold text-gray-800">
        Total Paid: <span className="text-4xl font-semibold text-green-600">${orderDetails.totalAmount}</span>
      </p>
      <DataTable columns={columns} data={orderDetails.products} searchKey="title" />
    </div>
  );
};

export default OrderDetails;