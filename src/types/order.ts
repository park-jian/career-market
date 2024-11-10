export interface OrderInfoOne {
  order_resume_id: number;
  title: string;
  status: string;
  price: number;
  sent_at: string | null;
  canceled_at: string | null;
}

export interface OrderInfo {
  order_id: number;
  paid_at: string;
  email: string;
  order_resume_responses: OrderInfoOne[];
}
export interface OrderOneInfo {
  order_id: number;
  paid_at: string;
  email: string;
  order_resume_responses: OrderInfoOne[];
  total_amount: number;
}
export interface OrderCardProps {
  order: OrderInfo;
}
export interface OrderCardInfo {
  order: OrderType;
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

export interface CartCardProps {
  item: CartResumeItem;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export interface LocationState {
  selectedProducts: CartResumeItem[];
  totalQuantity: number;
  totalPrice: number;
}

export interface OrderType {
  order_id: number;
  order_title: string;
  status: string;
  total_amount: number;
}

export interface Amount {
  currency: string;
  value: number;
}