import {
  useFetcher,
  type ActionFunctionArgs,
} from "react-router-dom";

import Button from "../../ui/Button";
import { updateOrder } from "../../services/apiRestaurant";

import type { OrderType } from "../../types/order";

interface UpdateOrderProps {
  order: OrderType;
}

function UpdateOrder({ order }: UpdateOrderProps) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Make priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

export async function action({
  params,
}: ActionFunctionArgs): Promise<null> {
  const data = {
    priority: true,
  };

  await updateOrder(params.orderId as string, data);

  return null;
}