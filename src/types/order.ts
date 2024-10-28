export interface OrderInfo {
  order_id: number;
  order_title: string;
  total_amount: number;
  status: string;
}
export interface OrderCardProps {
  order: OrderInfo;
}
export interface CartResumeItem {
  cart_resume_id: number;
  title: string;
  price: number;
}
export interface CartInfo {
  total_quantity: number,
  total_price: number,
  cart_resume_responses: CartResumeItem[]
}