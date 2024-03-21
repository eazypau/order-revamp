import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";

//components
import DataTable from "@/components/DataTable";
import AddEditOrderDialog from "./AddEditOrderDialog";

//hooks
import { Order, useGetOrders } from "@/hooks/orders";

//utils
import moment from "moment";
import startCase from "lodash/startCase";
import { useGetProducts } from "@/hooks/products";
import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "@/config/firebase";
import { keys } from "lodash";

export default function OrderTable() {
  const [orderIds, setOrderIds] = useState<{ [k: string]: boolean }>({});

  const { orderData, isLoading } = useGetOrders();
  const { productById, isLoading: isProductLoding } = useGetProducts();
  const [filterStatus, setFilterStatus] = useState("unfulfill");

  const orderFilter = useMemo(() => {
    if (!isLoading && orderData) {
      const filter = orderData.filter((item) => item.status === filterStatus);
      return filter;
    } else return [];
  }, [orderData, isLoading, filterStatus]);

  // table
  const columnHelper = createColumnHelper<Order>();
  const columns = useMemo(() => {
    return [
      columnHelper.accessor("id", {
        cell: (info) => (
          <input
            type="checkbox"
            className="checkbox"
            name={info.getValue()}
            checked={orderIds[info.getValue()!]}
            onChange={(e) =>
              setOrderIds((prev) => ({
                ...prev,
                [e.target.name]: e.target.checked,
              }))
            }
          />
        ),
        header: () => <span></span>,
      }),
      columnHelper.accessor("customer_name", {
        id: "customerName",
        cell: (info) => info.getValue(),
        header: () => <span>Customer Name</span>,
      }),
      columnHelper.accessor("hp_number", {
        id: "hpnNumber",
        cell: (info) => info.getValue(),
        header: () => <span>Phone No.</span>,
      }),
      columnHelper.accessor("delivery_date", {
        id: "deliveryDate",
        cell: (info) => moment(info.getValue()).format("DD/MM/YYYY"),
        header: () => <span>Delivery Date</span>,
      }),
      columnHelper.accessor("items", {
        id: "items",
        cell: (info) => {
          return (
            <ul>
              {productById &&
                info.getValue().map((item) => (
                  <li key={item.id}>
                    {productById[item.id].name}: {item.quantity}
                  </li>
                ))}
            </ul>
          );
        },
        header: () => <span>Items/quantiy</span>,
      }),
      columnHelper.accessor("total_price", {
        id: "totalPrice",
        cell: (info) => info.getValue(),
        header: () => <span>Total Price (RM)</span>,
      }),
      columnHelper.accessor("status", {
        id: "status",
        cell: (info) => startCase(info.getValue()),
        header: () => <span>Status</span>,
      }),
      columnHelper.accessor("editId", {
        cell: (info) => {
          return (
            <div className="flex justify-end">
              <AddEditOrderDialog mode="edit" orderId={info.getValue()} />
            </div>
          );
        },
        header: () => "",
      }),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProductLoding, orderIds]);

  const batchUpdateStatus = async (status: string) => {
    try {
      const orderRef = collection(db, "orders");
      const batch = writeBatch(db);
      keys(orderIds).forEach((orderId) =>
        batch.update(doc(orderRef, orderId), { status })
      );
      await batch.commit();
      alert("successfully updated selected orders");
      setOrderIds({});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {orderData && (
        <div className="flex items-center gap-3 mb-3">
          <p>Status: </p>
          <button
            type="button"
            className={
              "btn btn-sm" + (filterStatus === "unfulfill" ? " btn-accent" : "")
            }
            onClick={() => setFilterStatus("unfulfill")}
          >
            Unfulfill
          </button>
          <button
            type="button"
            className={
              "btn btn-sm" + (filterStatus === "fulfilled" ? " btn-accent" : "")
            }
            onClick={() => setFilterStatus("fulfilled")}
          >
            Fulfilled
          </button>
          <button
            type="button"
            className={
              "btn btn-sm" + (filterStatus === "canceled" ? " btn-accent" : "")
            }
            onClick={() => setFilterStatus("canceled")}
          >
            Canceled
          </button>
        </div>
      )}
      <DataTable columns={columns} data={!isLoading ? orderFilter : []} />
      {Object.values(orderIds).includes(true) && (
        <div className="fixed left-0 bottom-0 w-full mb-7 flex gap-3 justify-center items-center">
          <button
            type="button"
            className="btn"
            onClick={() => batchUpdateStatus("fulfilled")}
          >
            Fulfill Order
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => batchUpdateStatus("canceled")}
          >
            Cancel Order
          </button>
        </div>
      )}
    </>
  );
}
