import { useMemo } from "react";

//components
import DataTable from "@/components/DataTable";
import AddEditProductDialog from "./AddEditProductDialog";
import { createColumnHelper } from "@tanstack/react-table";

//hooks
import { Product, useGetProducts } from "@/hooks/products";

export default function ProductTable() {
  const { productData, isLoading } = useGetProducts();
  const columnHelper = createColumnHelper<Product>();

  // don't why this can cause the table to re-render like crazy without useMemo
  const columns = useMemo(() => {
    return [
      columnHelper.accessor("name", {
        cell: (info) => info.getValue(),
        header: () => "Product Name",
      }),
      columnHelper.accessor("price", {
        cell: (info) => info.getValue().toFixed(2),
        header: () => "Price (RM)",
      }),
      columnHelper.accessor("enable", {
        cell: (info) => {
          return info.getValue() === true ? "Yes" : "No";
        },
        header: () => "Active",
      }),
      columnHelper.accessor("id", {
        cell: (info) => {
          return (
            <div className="flex justify-end">
              <AddEditProductDialog mode="edit" productId={info.getValue()} />
            </div>
          );
        },
        header: () => "",
      }),
    ];
  }, []);

  return <DataTable columns={columns} data={!isLoading ? productData : []} />;
}
