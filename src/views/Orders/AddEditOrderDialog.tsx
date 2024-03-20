import { useState } from "react";

//components
import Modal from "@/components/Modal";
import TextInput from "@/components/FormInputs/TextInput";
import Divider from "@/components/Divider";
import DateTimeInput from "@/components/FormInputs/DateTimeInput";
import SelectItemsInput from "@/components/FormInputs/SelectItemsInput";

//form
import { Form, Formik, FormikHelpers } from "formik";
import * as yup from "yup";

//lodash
import groupBy from "lodash/groupBy";

//hooks
import { Order, useGetOrders } from "@/hooks/orders";
import { useGetProducts } from "@/hooks/products";

export default function AddEditOrderDialog({
  mode,
  orderId,
}: {
  mode: string;
  orderId?: string;
}) {
  const [closeModal, setCloseModal] = useState(false);

  const { orderById, createOrder, updateOrder } = useGetOrders();
  const { productData, productById } = useGetProducts();
  const defaultData = orderId ? orderById[orderId] : null;

  const initialValues = {
    customer_name: defaultData ? defaultData.customer_name : "",
    hp_number: defaultData ? defaultData.hp_number : "",
    delivery_date: defaultData ? defaultData.delivery_date : "",
    items: defaultData
      ? defaultData.items
      : [
          {
            id: "",
            quantity: 1,
          },
        ],
  };

  const validationSchema = yup.object().shape({
    customer_name: yup.string().required("Required"),
    hp_number: yup.string().required("Required"),
    delivery_date: yup.string().required("Required"),
    items: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.string().required("Required"),
          // name: yup.string().required("Required"),
          quantity: yup.number().min(1),
        })
      )
      .min(1, "Minimum one item is required"),
  });

  const onSubmit = async (
    values: Order,
    { resetForm, setSubmitting }: FormikHelpers<Order>
  ) => {
    setSubmitting(true);
    const itemSet = new Set(values.items);
    // check for duplicate items
    if (values.items.length !== itemSet.values.length) {
      // add it up
      const newItemList: { id: string; quantity: number }[] = [];
      const itemGroup = groupBy(values.items, "id");
      Object.keys(itemGroup).forEach((item) => {
        const newQuantity = itemGroup[item].reduce(
          (accumulator, currentValue) => accumulator + currentValue.quantity,
          0
        );
        newItemList.push({ id: item, quantity: newQuantity });
      });
      values.items = newItemList;
    }
    const totalPrice = values.items
      .reduce(
        (acc, currentVal) =>
          acc + currentVal.quantity * productById[currentVal.id].price,
        0
      )
      .toFixed(2);
    try {
      if (mode === "add") {
        await createOrder({
          ...values,
          total_price: Number(totalPrice),
          status: "unfulfill",
        });
      } else if (mode === "edit" && orderId) {
        await updateOrder(orderId, {
          ...values,
          total_price: Number(totalPrice),
        });
      }
      resetForm();
      setCloseModal(true);
      setSubmitting(false);
      setTimeout(() => {
        setCloseModal(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  return (
    <Modal
      buttonName={mode === "edit" ? "Edit" : "Create Order"}
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
                label="Customer Name"
                name="customer_name"
                placeholder="Eg: Billie EyeLash"
                formProps={formProps}
              />
              <TextInput
                label="Phone Number"
                name="hp_number"
                placeholder="Eg: +60123456789"
                formProps={formProps}
              />
              <DateTimeInput
                label="Delivery Date"
                name="delivery_date"
                formProps={formProps}
              />
              <SelectItemsInput
                name="items"
                label="List of items"
                options={productData}
                formProps={formProps}
              />
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
