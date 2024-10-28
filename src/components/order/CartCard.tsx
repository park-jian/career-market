

import { CartResumeItem } from '../../types/order';

interface CartCardProps {
  item: CartResumeItem;
  isSelected: boolean;
  onSelect: (id: number) => void;
}
  
  const CartCard: React.FC<CartCardProps> = ({item, isSelected, onSelect}) => {
  const {cart_resume_id, title, price} = item ;
  return (
    <li className="flex items-center p-4 hover:bg-gray-50 transition-colors">
      <div className="w-16 flex justify-center">
        <input 
          type="checkbox" 
          className="w-4 h-4 rounded border-gray-300"
          checked={isSelected}
          onChange={() => onSelect(cart_resume_id)}
        />
      </div>
      <div className="flex-1 px-4">
        <h3 className="font-medium text-lg">{title}</h3>
      </div>
      <div className="w-32 text-right font-medium">
        {price.toLocaleString()}원
      </div>

    </li>
  );
};
export default CartCard;