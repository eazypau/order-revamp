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

export interface Product {
  id?: string;
  name: string;
  enable: boolean;
  price: number;
}

interface ProductData extends Omit<Product, "id"> {
  id: string;
}

export function useGetProducts() {
  const productCollectionRef = collection(db, "products");

  const { data, isLoading, refetch } = useGetDocuments({
    queryKey: ["products"],
    queryRef: query(productCollectionRef),
    subscribe: true,
  });

  const createProducts = async (formData: Product) => {
    try {
      await addDoc(productCollectionRef, {
        ...formData,
        created_at: serverTimestamp(),
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const updateProduct = async (id: string, formData: Partial<Product>) => {
    try {
      await updateDoc(doc(productCollectionRef, id), {
        ...formData,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const productQueryData = data as ProductData[];

  const productMemo = useMemo(() => {
    if (productQueryData && !isLoading) {
      return orderBy(productQueryData, ["created_at"]);
    } else return [];
  }, [productQueryData, isLoading]);

  const productById = useMemo(() => {
    return keyBy(productMemo, "id");
  }, [productMemo]);

  return {
    createProducts,
    updateProduct,
    productData: productMemo,
    productById,
    isLoading,
    refetch,
  };
}
