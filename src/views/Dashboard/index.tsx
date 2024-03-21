import { useMemo } from "react";
import moment from "moment";

//lodash
import groupBy from "lodash/groupBy";
import keys from "lodash/keys";

//components
import GridItems from "@/components/GridItems";
import AddEditOrderDialog from "../Orders/AddEditOrderDialog";
import AddEditProductDialog from "../Products/AddEditProductDialog";

//hooks
import { useGetOrders } from "@/hooks/orders";
import { useGetProducts } from "@/hooks/products";

interface Item {
  id: string;
  quantity: number;
}

function Dashboard() {
  const { orderData, isLoading: isOrderLoading } = useGetOrders();
  const { productById, isLoading: isProductLoading } = useGetProducts();

  // extract all items into one array
  // group it by product id
  // get total quantity then create id, name and value object format
  const overallDemand = useMemo(() => {
    if (!isOrderLoading && orderData && productById) {
      const dataFormat: { id: string; name: string; value: string }[] = [];
      const itemArray: Item[] = [];
      orderData.forEach((order) => {
        if (order.status === "unfulfill") itemArray.push(...order.items);
      });
      const productGroup = groupBy(itemArray, "id");

      keys(productGroup).forEach((key) => {
        const totalQuantity = productGroup[key].reduce(
          (acc, currentVal) => acc + currentVal.quantity,
          0
        );
        dataFormat.push({
          id: key,
          name: productById[key].name,
          value: String(totalQuantity),
        });
      });

      return dataFormat;
    } else return [];
  }, [isOrderLoading, orderData, productById]);

  const todayDemand = useMemo(() => {
    if (!isOrderLoading && orderData && productById) {
      // set timezone and time to 0
      const todayDate = moment(new Date())
        .utcOffset(0)
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .valueOf();
      const dataFormat: { id: string; name: string; value: string }[] = [];
      const itemArray: Item[] = [];
      orderData.forEach((order) => {
        const orderCreationDate = moment(order.created_at?.toDate())
          .utcOffset(0)
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .valueOf();

        if (order.status === "unfulfill" && orderCreationDate === todayDate)
          itemArray.push(...order.items);
      });
      const productGroup = groupBy(itemArray, "id");

      keys(productGroup).forEach((key) => {
        const totalQuantity = productGroup[key].reduce(
          (acc, currentVal) => acc + currentVal.quantity,
          0
        );
        dataFormat.push({
          id: key,
          name: productById[key].name,
          value: String(totalQuantity),
        });
      });

      return dataFormat;
    } else return [];
  }, [isOrderLoading, orderData, productById]);

  const orderDemand = useMemo(() => {
    if (!isOrderLoading && orderData) {
      const todayDate = moment(new Date())
        .utcOffset(0)
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .valueOf();
      const newOrders = [];
      const unfulfillOrders = [];
      const fulfilledOrders = [];
      const canceledOrders = [];

      orderData.forEach((order) => {
        const createdDate = moment(order.created_at?.toDate())
          .utcOffset(0)
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .valueOf();
        const updatedDate = order.updated_at
          ? moment(order.updated_at?.toDate())
              .utcOffset(0)
              .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
              .valueOf()
          : null;
        const deliveryDate = moment(new Date(order.delivery_date))
          .utcOffset(0)
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .valueOf();

        if (order.status === "unfulfill" && createdDate === todayDate) {
          newOrders.push(order);
        }
        if (order.status === "unfulfill" && deliveryDate === todayDate) {
          unfulfillOrders.push(order);
        }
        if (order.status === "fulfilled" && deliveryDate === todayDate) {
          fulfilledOrders.push(order);
        }
        if (order.status === "canceled" && updatedDate === todayDate) {
          canceledOrders.push(order);
        }
      });

      return [
        {
          id: "neworders",
          name: "New Orders",
          value: newOrders.length,
        },
        {
          id: "orderstofulfill",
          name: "Orders to Fulfill",
          value: unfulfillOrders.length,
        },
        {
          id: "fulfilledorders",
          name: "Fulfilled Orders",
          value: fulfilledOrders.length,
        },
        {
          id: "cancelledorders",
          name: "Cancelled Orders",
          value: canceledOrders.length,
        },
      ];
    } else return [];
  }, [orderData, isOrderLoading]);

  return (
    <div className="md:px-6 lg:w-2/3 mx-auto mt-3">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="bg-white py-2 sm:py-3 lg:py-4">
        <h2 className="mb-3 text-2xl font-semibold text-gray-800 lg:text-2xl">
          Shortcuts
        </h2>
        <div className="flex gap-2">
          <AddEditOrderDialog mode="add" />
          <AddEditProductDialog mode="add" />
        </div>
      </div>
      <GridItems sectionName="Overall Demand" items={overallDemand} />
      <GridItems sectionName="Demand (Today)" items={todayDemand} />
      <GridItems sectionName="Order Summary (Today)" items={orderDemand} />
    </div>
  );
}

export default Dashboard;
