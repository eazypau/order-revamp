import { FormikErrors, FormikTouched, FormikValues } from "formik";

interface FormProps {
  errors: FormikErrors<any>;
  touched: FormikTouched<any>;
  values: FormikValues;
  handleChange: (e: any) => void;
  handleBlur: (e: any) => void;
}

function TextInput({
  type = "text",
  label,
  name,
  placeholder,
  disabled = false,
  formProps,
}: {
  type?: string;
  label: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  formProps: FormProps;
}) {
  const { errors, touched, values, handleChange, handleBlur } = formProps;
  return (
    <div>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className="input input-bordered w-full"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[name]}
          autoFocus={false}
          disabled={disabled}
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

export default TextInput;
