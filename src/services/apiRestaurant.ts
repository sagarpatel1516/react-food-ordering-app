import type { Pizza } from "../types/pizza";
import type { CartItem } from "../types/cart";
import type { OrderType } from "../types/order";

const API_URL = "https://react-fast-pizza-api.jonas.io/api";

interface ApiResponse<T> {
  data: T;
}

export interface CreateOrderData {
  customer: string;
  phone: string;
  address: string;
  priority: boolean;
  cart: CartItem[];
  position?: string;
}

// ======================
// GET MENU
// ======================

export async function getMenu(): Promise<Pizza[]> {
  const res = await fetch(`${API_URL}/menu`);

  if (!res.ok) {
    throw new Error("Failed getting menu");
  }

  const { data }: ApiResponse<Pizza[]> = await res.json();

  return data;
}

// ======================
// GET ORDER
// ======================

export async function getOrder(
  id: string,
): Promise<OrderType> {
  const res = await fetch(`${API_URL}/order/${id}`);

  if (!res.ok) {
    throw new Error(`Couldn't find order #${id}`);
  }

  const { data }: ApiResponse<OrderType> = await res.json();

  return data;
}

// ======================
// CREATE ORDER
// ======================

export async function createOrder(
  newOrder: CreateOrderData,
): Promise<OrderType> {
  try {
    const res = await fetch(`${API_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
    });

    if (!res.ok) {
      throw new Error();
    }

    const { data }: ApiResponse<OrderType> = await res.json();

    return data;
  } catch {
    throw new Error("Failed creating your order");
  }
}

// ======================
// UPDATE ORDER
// ======================

export async function updateOrder(
  id: string,
  updateObj: Partial<Pick<OrderType, "priority">>,
): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/order/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateObj),
    });

    if (!res.ok) {
      throw new Error();
    }
  } catch {
    throw new Error("Failed updating your order");
  }
}