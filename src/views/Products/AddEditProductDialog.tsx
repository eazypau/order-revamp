import { useState } from "react";

//components
import Modal from "@/components/Modal";
import TextInput from "@/components/FormInputs/TextInput";
import Divider from "@/components/Divider";

//form
import { Form, Formik, FormikHelpers } from "formik";
import * as yup from "yup";

//hooks
import { Product, useGetProducts } from "@/hooks/products";

export default function AddEditProductDialog({
  mode,
  productId,
}: {
  mode: string;
  productId?: string;
}) {
  const [closeModal, setCloseModal] = useState(false);

  const { createProducts, updateProduct, productById, refetch } =
    useGetProducts();
  const defaultData = productId ? (productById[productId] as Product) : null;

  const initialValues: Product = {
    name: defaultData ? defaultData.name : "",
    price: defaultData ? defaultData.price : 0,
    enable: defaultData ? defaultData.enable : false,
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Required"),
    price: yup.string().required("Required"),
  });

  const onSubmit = async (
    values: Product,
    { resetForm, setSubmitting }: FormikHelpers<Product>
  ) => {
    setSubmitting(true);
    try {
      if (mode === "add") {
        await createProducts(values);
      } else if (mode === "edit" && productId) {
        await updateProduct(productId, values);
      }
      await refetch();
      resetForm();
      setCloseModal(true);
      setSubmitting(false);
      setTimeout(() => {
        setCloseModal(false);
      }, 1000);
    } catch (error: any) {
      console.log(error.message);
      setSubmitting(false);
    }
  };

  return (
    <Modal
      buttonName={mode === "edit" ? "Edit" : "Create Product"}
      buttonClass={mode === "edit" ? "btn btn-outline btn-sm text-sm" : null}
      closeModal={closeModal}
    >
      <p className="text-lg font-semibold">Create New Order</p>
      <Divider />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleBlur,
          resetForm,
          setFieldValue,
          isSubmitting,
          isValid,
        }) => {
          const formProps = {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
          };

          return (
            <Form tabIndex={0} style={{ outline: "none" }}>
              <TextInput
                label="Product Name"
                name="name"
                placeholder="Eg: Cookies"
                disabled={isSubmitting}
                formProps={formProps}
              />
              <TextInput
                type="number"
                label="Price"
                name="price"
                placeholder="Eg: 5.50"
                disabled={isSubmitting}
                formProps={formProps}
              />
              <div className="form-control mt-3">
                <label className="label cursor-pointer">
                  <span className="label-text">Active</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    checked={values.enable}
                    onChange={(e) => setFieldValue("enable", e.target.checked)}
                    disabled={isSubmitting}
                  />
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    resetForm();
                    setCloseModal(true);
                    setTimeout(() => {
                      setCloseModal(false);
                    }, 1000);
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-secondary"
                  disabled={isSubmitting || !isValid}
                >
                  Submit
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}
