

import { CartResumeItem } from '../../types/order';

interface CartCardProps {
  item: CartResumeItem;
}
  
  const CartCard: React.FC<CartCardProps> = ({item}) => {
  const {title, price} = item ;
  return (
    <li className="flex border w-full text-center justify-center items-center">
        <div className="border-r w-1/12 p-3">
            <input type="checkbox" />
        </div>
        <div className="border-r w-3/12 p-3">
            <div>이미지</div>
        </div>
        <div className="w-6/12">
          <div>{title}</div>
          <div>{price}</div>
        </div>
        <div className="w-2/12">
            <button className="px-2 py-1 border-b-2 rounded-none font-semibold text-xl hover:bg-yellow-800 hover:text-yellow-200">삭제</button>
        </div>
    </li>    
  );
}
export default CartCard;