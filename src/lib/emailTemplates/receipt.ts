interface ReceiptProps {
  customerName: string;
  orderId: number;
  phone: string;
  items: string[];
  total: number;
}

export function receiptEmail({
  customerName,
  orderId,
  phone,
  items,
  total,
}: ReceiptProps) {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2>🐾 Anubis Paws – Payment Receipt</h2>
      <p>Hi <b>${customerName}</b>,</p>

      <p>Thank you for your order. Here are your receipt details:</p>

      <p><b>Order ID:</b> #${orderId}</p>
      <p><b>Phone:</b> ${phone}</p>

      <h3>Items</h3>
      <ul>
        ${items.map(i => `<li>${i}</li>`).join("")}
      </ul>

      <h3>Total Paid: NPR ${total}</h3>

      <p>Status: <b>Payment Verified</b> ✅</p>

      <hr />
      <p style="color:#777">
        Anubis Paws 🐾<br/>
        Thank you for supporting pet care.
      </p>
    </div>
  `;
}
