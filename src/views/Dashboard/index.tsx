// home page will be dashboard
// show today's demand
// show graph demand per week and month
// show total order fulfiled graph {maybe}
// show total order need to fulfill graph
// show total sale graph {maybe}
import GridItems from "@/components/GridItems";
import { orderSummary, productList } from "@/utils/dummyData";
import AddEditOrderDialog from "../Orders/AddEditOrderDialog";
import AddEditProductDialog from "../Products/AddEditProductDialog";

function Dashboard() {
  return (
    <div className="w-2/3 mx-auto mt-3">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <GridItems sectionName="Product Demand (Today)" items={productList} />
      <GridItems sectionName="Order Summary (Today)" items={orderSummary} />
      <div className="bg-white py-2 sm:py-3 lg:py-4">
        <div className="mx-auto max-w-screen-xl px-4 md:px-0">
          <div className="mb-3 md:mb-5">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800 md:mb-6 lg:text-2xl">
              Shortcuts
            </h2>
          </div>
          <div className="flex gap-2">
            <AddEditOrderDialog mode="add" />
            <AddEditProductDialog mode="add" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
