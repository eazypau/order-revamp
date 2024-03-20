import { useMemo } from "react";

//firebase
import { db } from "@/config/firebase";
import { useGetDocuments } from "@/config/firebaseFunctions";
import {
  addDoc,
  collection,
  doc,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

//lodash
import { keyBy, orderBy } from "lodash";

export interface Order {
  id?: string;
  customer_name: string;
  hp_number: string;
  delivery_date: string | Date;
  items: {
    id: string;
    name?: string;
    quantity: number;
  }[];
  total_price?: number;
  status?: string;
}

export function useGetOrders() {
  const orderCollectionRef = collection(db, "orders");

  const { data, isLoading, refetch } = useGetDocuments({
    queryKey: ["orders"],
    queryRef: query(orderCollectionRef),
    subscribe: true,
  });

  const createOrder = async (formData: Order) => {
    try {
      await addDoc(orderCollectionRef, {
        ...formData,
        created_at: serverTimestamp(),
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const updateOrder = async (id: string, formData: Partial<Order>) => {
    try {
      await updateDoc(doc(orderCollectionRef, id), {
        ...formData,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const orderQueryData = data as Order[];

  const orderMemo = useMemo(() => {
    if (orderQueryData && !isLoading) {
      return orderBy(orderQueryData, ["created_at"]);
    } else return [];
  }, [orderQueryData, isLoading]);

  const orderById = useMemo(() => {
    return keyBy(orderMemo, "id");
  }, [orderMemo]);

  return {
    createOrder,
    updateOrder,
    orderData: orderMemo,
    orderById,
    isLoading,
    refetch,
  };
}
