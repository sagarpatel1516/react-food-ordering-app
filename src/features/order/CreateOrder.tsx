import { useState } from "react";
import {
  Form,
  useNavigation,
  useActionData,
  redirect,
  type ActionFunctionArgs,
} from "react-router-dom";

import Button from "../../ui/Button";
import EmptyCart from "../cart/EmptyCart";
import { createOrder } from "../../services/apiRestaurant";
import { formatCurrency } from "../../utils/helpers";

import store from "../../store";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import { fetchAddress } from "../user/userSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

const isValidPhone = (str: string): boolean =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState<boolean>(false);

  const {
    userName,
    address,
    position,
    status: addressStatus,
    error: errorAddress,
  } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const formErrors = useActionData() as
    | Record<string, string>
    | undefined;

  const cart = useAppSelector(getCart);
  const totalCartPrice = useAppSelector(getTotalCartPrice);

  const isLoadingAddress = addressStatus === "loading";

  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">
        Ready to order? Let&apos;s go!
      </h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>

          <input
            className="input grow"
            type="text"
            name="customer"
            defaultValue={userName}
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>

          <div className="grow">
            <input
              className="input w-full"
              type="tel"
              name="phone"
              required
            />

            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start">
          <label className="sm:basis-40 sm:pt-3">Address</label>

          <div className="relative grow">
            <input
              className="input w-full pr-40"
              type="text"
              name="address"
              defaultValue={address}
              disabled={isLoadingAddress}
              required
            />

            {!position.latitude && !position.longitude && (
              <span className="absolute right-1 top-1">
                <Button
                  type="small"
                  disabled={isLoadingAddress}
                  onClick={(
                    e: React.MouseEvent<HTMLButtonElement>,
                  ) => {
                    e.preventDefault();
                    dispatch(fetchAddress());
                  }}
                >
                  Get current location
                </Button>
              </span>
            )}

            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            id="priority"
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            checked={withPriority}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWithPriority(e.target.checked)
            }
          />

          <label htmlFor="priority" className="font-medium">
            Want to give your order priority?
          </label>
        </div>

        <input
          type="hidden"
          name="cart"
          value={JSON.stringify(cart)}
        />

        <input
          type="hidden"
          name="position"
          value={
            position.latitude && position.longitude
              ? `${position.latitude},${position.longitude}`
              : ""
          }
        />

        <Button
          type="primary"
          disabled={isSubmitting || isLoadingAddress}
        >
          {isSubmitting
            ? "Placing order..."
            : `Order now for ${formatCurrency(totalPrice)}`}
        </Button>
      </Form>
    </div>
  );
}

export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();

  const data = Object.fromEntries(
    formData,
  ) as Record<string, string>;

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  const errors: Record<string, string> = {};

  if (!isValidPhone(order.phone)) {
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you.";
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  const newOrder = await createOrder(order);

  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;