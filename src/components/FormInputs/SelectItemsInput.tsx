import { FieldArray, FormikErrors, FormikTouched, FormikValues } from "formik";

interface FormProps {
  errors: FormikErrors<any>;
  touched: FormikTouched<any>;
  values: FormikValues;
  handleChange: (e: any) => void;
  handleBlur: (e: any) => void;
}

interface Item {
  id: string;
  name: string;
  quantity: number;
}

interface SelectOption {
  id: string;
  name: string;
  enable: boolean;
}

function SelectItemsInput({
  label,
  name,
  options,
  formProps,
}: {
  label: string;
  name: string;
  options: SelectOption[];
  formProps: FormProps;
}) {
  const { errors, touched, values, handleChange, handleBlur } = formProps;
  return (
    <div>
      <div className="label">
        <p className="label-text">{label}</p>
      </div>
      <FieldArray name={name}>
        {({ remove, push }) => (
          <>
            <div>
              {values[name].map((item: Item, index: number) => (
                <div
                  key={item.id + index}
                  className="flex justify-between gap-3 mb-3"
                >
                  <div className="w-full">
                    <select
                      className="select select-bordered w-full"
                      name={`${name}[${index}].id`}
                      onChange={handleChange}
                      value={item.id}
                    >
                      <option disabled value="">
                        Choose an item
                      </option>
                      {options &&
                        options.map((option) => (
                          <option
                            key={option.id}
                            value={option.id}
                            disabled={!option.enable}
                          >
                            {option.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`${name}.[${index}].quantity`}>
                      <input
                        type="number"
                        name={`${name}.[${index}].quantity`}
                        min={0}
                        className="input input-bordered w-16 text-center"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={item.quantity}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-sm btn-neutral w-full"
              onClick={() => push({ id: "", quantity: 1 })}
            >
              + Add Item
            </button>
          </>
        )}
      </FieldArray>
    </div>
  );
}

export default SelectItemsInput;
