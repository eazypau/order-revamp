//components
import AddEditOrderDialog from "./AddEditOrderDialog";
import OrderTable from "./OrderTable";

export default function OrdersView() {
  return (
    <div className="w-2/3 mx-auto mt-3 relative">
      <div className="flex justify-end mb-5">
        <AddEditOrderDialog mode="add" />
      </div>
      <OrderTable />
    </div>
  );
}
