// lib/types.ts

export enum PaymentMethod {
  ESEWA = "ESEWA",
  KHALTI = "KHALTI",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface PaymentRequestData {
  orderId: number;
  amount: string;
  method: PaymentMethod;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
}

export interface EsewaConfig {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature?: string;
}

export interface KhaltiConfig {
  return_url: string;
  website_url: string;
  amount: number;
  purchase_order_id: string;
  purchase_order_name: string;
  customer_info?: {
    name: string;
    email: string;
    phone: string;
  };
}