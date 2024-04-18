import { useMemo, useState } from "react";

//components
import DataTable from "@/components/DataTable";
import AddEditProductDialog from "./AddEditProductDialog";
import { createColumnHelper } from "@tanstack/react-table";

//hooks
import { Product, useGetProducts } from "@/hooks/products";
import EditProductDialog from "./EditProductDialog";

export default function ProductTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState("");

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
        enableColumnFilter: false,
      }),
      columnHelper.accessor("enable", {
        cell: (info) => {
          return info.getValue() === true ? "Yes" : "No";
        },
        header: () => "Active",
        enableColumnFilter: false,
      }),
      columnHelper.accessor("id", {
        cell: (info) => {
          const openDialog = () => {
            setSelectedProductToEdit(info.getValue() as string);
            setIsOpen(true);
          };

          return (
            <button
              type="button"
              className="btn btn-outline btn-sm text-sm"
              onClick={openDialog}
            >
              Edit
            </button>
          );
        },
        header: () => "",
        enableColumnFilter: false,
      }),
    ];
  }, []);

  return (
    <>
      <EditProductDialog
        isOpen={isOpen}
        setIsOpen={(value: boolean) => setIsOpen(value)}
        productId={selectedProductToEdit}
        clearSelected={() => setSelectedProductToEdit("")}
      />
      <DataTable columns={columns} data={!isLoading ? productData : []} />
    </>
  );
}
