import { useEffect } from "react";
import { Query, getDocs, onSnapshot } from "firebase/firestore";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetDocuments({
  queryRef,
  queryKey,
  subscribe = false,
  disabled = false,
}: {
  queryRef: Query | undefined;
  queryKey: QueryKey;
  subscribe?: boolean;
  disabled?: boolean;
}) {
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      let querySnapshot;
      if (queryRef) querySnapshot = await getDocs(queryRef);
      else return undefined;
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !disabled,
  });

  useEffect(() => {
    if (queryRef) {
      const unsubscribe = onSnapshot(queryRef, (snapShot) => {
        const results = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        queryClient.setQueryData(queryKey, results);
      });
      if (!subscribe) {
        unsubscribe();
      }
      return () => {
        unsubscribe();
      };
    }
  }, [subscribe, JSON.stringify(queryKey)]);

  return { data, isLoading, isFetching, refetch };
}
