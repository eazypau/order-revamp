import { FormikErrors, FormikTouched, FormikValues } from "formik";

interface FormProps {
  errors: FormikErrors<any>;
  touched: FormikTouched<any>;
  values: FormikValues;
  handleChange: (e: any) => void;
  handleBlur: (e: any) => void;
}

function DateTimeInput({
  label,
  name,
  placeholder,
  formProps,
}: {
  label: string;
  name: string;
  placeholder?: string;
  formProps: FormProps;
}) {
  const { errors, touched, values, handleChange, handleBlur } = formProps;
  const minDate = new Date().toISOString().split("T")[0];
  return (
    <div>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <input
          type="date"
          name={name}
          placeholder={placeholder}
          className="input input-bordered w-full"
          min={minDate}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[name]}
        />
        {/* show error if any */}
        {touched[name] && errors[name] && (
          <div className="label">
            <span className="label-text-alt text-red-500">
              {errors[name] as string}
            </span>
          </div>
        )}
      </label>
    </div>
  );
}

export default DateTimeInput;
