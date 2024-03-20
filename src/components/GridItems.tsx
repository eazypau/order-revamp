import startCase from "lodash/startCase";

interface GridItem {
  name: string;
  value: string | number;
}

function GridItems({
  sectionName,
  items,
}: {
  sectionName: string;
  items: GridItem[];
}) {
  return (
    <div className="bg-white py-2 sm:py-3 lg:py-4">
      <div className="mx-auto max-w-screen-xl px-4 md:px-0">
        <div className="mb-3 md:mb-5">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 md:mb-6 lg:text-2xl">
            {sectionName}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex flex-col items-center justify-center p-4 lg:p-8 shadow"
            >
              <div className="text-sm font-semibold sm:text-base">
                {startCase(item.name)}
              </div>
              <div className="text-xl font-bold text-indigo-500 sm:text-2xl md:text-3xl xl:text-4xl">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GridItems;
