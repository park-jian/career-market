// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {getOrderList, addNewOrder, getOrderListView, getCartList } from "../api/order"
// import { OrderInfo, CartInfo  } from "../types/order";

// // export function useOrder(id: number | undefined) {
// //     return useQuery<OrderInfo, Error>({
// //       queryKey: ["order", id],
// //       queryFn: () => id !== undefined ? getOrderListView(id) : Promise.reject('Invalid ID'),
// //       staleTime: 1000 * 60,
// //       enabled: id !== undefined, // id가 undefined일 때는 쿼리를 실행하지 않음
// //     });
// //   }

// // export default function useOrders() {
// //   const queryClient = useQueryClient();

// //   const ordersQuery = useQuery<OrderInfo[], Error>({
// //     queryKey: ["orders"],
// //     queryFn: getOrderList,
// //     staleTime: 1000 * 60, // 1분
// //   });

// //   const addOrder = useMutation({
// //     mutationFn: (order: Omit<OrderInfo, 'id'>) => addNewOrder(order),
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["orders"] });
// //     },
// //   });

// //   const cartQuery = useQuery<CartInfo[], Error>({
// //     queryKey: ["cart"],
// //     queryFn: getCartList,  // getCartList의 반환 타입이 Promise<CartInfo[]>로 정의되어 있다고 가정합니다.
// //     staleTime: 1000 * 60,
// //   });
//   // return { ordersQuery, addOrder, useOrder, cartQuery };
// }
