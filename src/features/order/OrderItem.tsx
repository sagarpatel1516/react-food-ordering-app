import { formatCurrency } from "../../utils/helpers";
import type { OrderItemType } from "../../types/order";

interface OrderItemProps {
  item: OrderItemType;
  isLoadingIngredients?: boolean;
  ingredients?: string[];
}

function OrderItem({
  item,
  isLoadingIngredients,
  ingredients,
}: OrderItemProps) {
  const { quantity, name, totalPrice } = item;

  return (
    <li className="py-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <p>
          <span className="font-bold">{quantity}&times;</span> {name}
        </p>

        <p className="font-bold">
          {formatCurrency(totalPrice)}
        </p>
      </div>

      {/* Uncomment if you use these props later */}
      {/* {ingredients && (
        <p className="text-sm italic text-stone-500">
          {isLoadingIngredients
            ? "Loading..."
            : ingredients.join(", ")}
        </p>
      )} */}
    </li>
  );
}

export default OrderItem;