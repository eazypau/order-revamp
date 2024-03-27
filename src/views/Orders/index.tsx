//components
import AddEditOrderDialog from "./AddEditOrderDialog";
import OrderTable from "./OrderTable";

export default function OrdersView() {
  return (
    <div className="px-2 md:px-6 lg:w-2/3 mx-auto mt-3 relative">
      <div className="flex justify-end mb-5">
        <AddEditOrderDialog mode="add" />
      </div>
      <OrderTable />
    </div>
  );
}
