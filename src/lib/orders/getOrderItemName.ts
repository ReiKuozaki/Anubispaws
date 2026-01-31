// import type { Order } from "@/types/order"; // optional, see note below

export function getOrderItemName(order: any): string {
  if (order.order_pets?.length > 0) {
    return order.order_pets.map((p: any) => p.name).join(", ");
  }

  if (order.order_products?.length > 0) {
    return order.order_products.map((p: any) => p.name).join(", ");
  }

  return `Order #${order.id}`;
}
