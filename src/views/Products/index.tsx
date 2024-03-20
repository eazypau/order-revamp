//components
import AddEditProductDialog from "./AddEditProductDialog";
import ProductTable from "./ProductTable";

export default function ProductsView() {
  return (
    <div className="w-2/3 mx-auto mt-3">
      <div className="flex justify-end mb-5">
        <AddEditProductDialog mode="add" />
      </div>
      <ProductTable />
    </div>
  );
}
