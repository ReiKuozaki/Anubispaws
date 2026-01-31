// // app/api/checkout-session/route.ts
// import { NextResponse } from "next/server";
// import { v4 as uuidv4 } from "uuid";
// import { generateEsewaSignature } from "@/lib/generateEsewaSignature";
// import { PaymentMethod, PaymentStatus } from "@/lib/types";
// import { createPaymentRecord } from "@/lib/payments";


// function validateEnvironmentVariables() {
//   const requiredEnvVars = [
//     "NEXT_PUBLIC_BASE_URL",
//     "NEXT_PUBLIC_ESEWA_MERCHANT_CODE",
//     "NEXT_PUBLIC_ESEWA_SECRET_KEY",
//     "KHALTI_SECRET_KEY",
//   ];

//   for (const envVar of requiredEnvVars) {
//     if (!process.env[envVar]) {
//       throw new Error(`Missing environment variable: ${envVar}`);
//     }
//   }
// }

// // POST - Initialize Payment
// export async function POST(req: Request) {
//   console.log("Received POST request to /api/checkout-session");

//   try {
//     validateEnvironmentVariables();
//     const paymentData = await req.json();
//     const { orderId, amount, method, userEmail, userName, userPhone } =
//       paymentData;

//     if (!orderId || !amount || !method) {
//       console.error("Missing required fields:", paymentData);
//       return NextResponse.json(
//         { error: "Missing required fields: orderId, amount, or method" },
//         { status: 400 }
//       );
//     }

//     // Verify order exists
//     const order = await prisma.orders.findUnique({
//       where: { id: parseInt(orderId) },
//       include: {
//         users: true,
//       },
//     });

//     if (!order) {
//       return NextResponse.json(
//         { error: "Order not found" },
//         { status: 404 }
//       );
//     }

//     // Check if payment already exists for this order
//     const existingPayment = await prisma.payments.findUnique({
//       where: { order_id: parseInt(orderId) },
//     });

//     if (existingPayment) {
//       return NextResponse.json(
//         { error: "Payment already exists for this order" },
//         { status: 400 }
//       );
//     }

//     // Create payment record in database
//     const payment = await prisma.payments.create({
//       data: {
//         order_id: parseInt(orderId),
//         amount: parseFloat(amount),
//         paymentMethod: method as PaymentMethod,
//         paymentStatus: PaymentStatus.PENDING,
//         userId: order.user_id,
//         userEmail: userEmail || order.customer_email || order.users.email,
//         userName: userName || order.customer_name || order.users.name,
//         userPhone: userPhone || order.contact_phone?.toString() || null,
//       },
//     });

//     console.log("Payment record created:", payment.id);

//     switch (method) {
//       case PaymentMethod.ESEWA: {
//         console.log("Initiating eSewa payment");
//         const transactionUuid = `${Date.now()}-${uuidv4()}`;

//         const esewaConfig = {
//           amount: amount,
//           tax_amount: "0",
//           total_amount: amount,
//           transaction_uuid: transactionUuid,
//           product_code: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE!,
//           product_service_charge: "0",
//           product_delivery_charge: "0",
//           success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?method=esewa&paymentId=${payment.id}`,
//           failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/failure?method=esewa&paymentId=${payment.id}`,
//           signed_field_names: "total_amount,transaction_uuid,product_code",
//         };

//         const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
//         const signature = generateEsewaSignature(
//           process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY!,
//           signatureString
//         );

//         console.log("eSewa config generated");

//         return NextResponse.json({
//           paymentId: payment.id,
//           orderId: orderId,
//           amount: amount,
//           esewaConfig: {
//             ...esewaConfig,
//             signature,
//             product_service_charge: Number(esewaConfig.product_service_charge),
//             product_delivery_charge: Number(
//               esewaConfig.product_delivery_charge
//             ),
//             tax_amount: Number(esewaConfig.tax_amount),
//             total_amount: Number(esewaConfig.total_amount),
//           },
//         });
//       }

//       case PaymentMethod.KHALTI: {
//         console.log("Initiating Khalti payment");

//         const khaltiConfig = {
//           return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?method=khalti&paymentId=${payment.id}`,
//           website_url: process.env.NEXT_PUBLIC_BASE_URL!,
//           amount: Math.round(parseFloat(amount) * 100), // Convert to paisa
//           purchase_order_id: payment.id,
//           purchase_order_name: `Order #${orderId}`,
//           customer_info: {
//             name: payment.userName || "Customer",
//             email: payment.userEmail || "customer@example.com",
//             phone: payment.userPhone || "9800000000",
//           },
//         };

//         const response = await fetch(
//           "https://dev.khalti.com/api/v2/epayment/initiate/",
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(khaltiConfig),
//           }
//         );

//         if (!response.ok) {
//           const errorData = await response.json();
//           console.error("Khalti API Error:", errorData);

//           // Delete payment record if initiation fails
//           await prisma.payments.delete({ where: { id: payment.id } });

//           throw new Error(
//             `Khalti payment initiation failed: ${JSON.stringify(errorData)}`
//           );
//         }

//         const khaltiResponse = await response.json();
//         console.log("Khalti payment initiated");

//         return NextResponse.json({
//           paymentId: payment.id,
//           orderId: orderId,
//           khaltiPaymentUrl: khaltiResponse.payment_url,
//           khaltiPidx: khaltiResponse.pidx,
//         });
//       }

//       default:
//         console.error("Invalid payment method:", method);
//         await prisma.payments.delete({ where: { id: payment.id } });
//         return NextResponse.json(
//           { error: "Invalid payment method" },
//           { status: 400 }
//         );
//     }
//   } catch (err) {
//     console.error("Payment API Error:", err);
//     return NextResponse.json(
//       {
//         error: "Error creating payment session",
//         details: err instanceof Error ? err.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }

// // GET - Verify Payment
// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const paymentId = searchParams.get("paymentId");
//   const method = searchParams.get("method");
//   const pidx = searchParams.get("pidx");
//   const data = searchParams.get("data");

//   if (!method || !paymentId) {
//     return NextResponse.json(
//       { status: "error", message: "Missing payment method or payment ID" },
//       { status: 400 }
//     );
//   }

//   try {
//     // eSewa Payment Verification
//     if (method === "esewa" && data) {
//       let decoded;
//       try {
//         decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
//       } catch (err) {
//         console.error("Failed to decode eSewa data:", err);
//         return NextResponse.json(
//           { status: "error", message: "Invalid eSewa payload" },
//           { status: 400 }
//         );
//       }

//       if (decoded.status !== "COMPLETE") {
//         return NextResponse.json({ status: "pending" });
//       }

//       console.log("Verifying eSewa transaction with server...");

//       // Check if payment record exists
//       const existingPayment = await prisma.payments.findUnique({
//         where: { id: paymentId },
//         select: {
//           userId: true,
//           paymentStatus: true,
//           amount: true,
//           esewaTransactionUuid: true,
//           order_id: true,
//         },
//       });

//       if (!existingPayment) {
//         console.error("Payment record not found");
//         return NextResponse.json(
//           { status: "error", message: "Payment not found" },
//           { status: 404 }
//         );
//       }

//       // Prevent payment reuse
//       if (existingPayment.paymentStatus === PaymentStatus.COMPLETED) {
//         console.error("Payment already processed", { paymentId });
//         return NextResponse.json(
//           { status: "error", message: "Payment has already been processed" },
//           { status: 400 }
//         );
//       }

//       const esewaVerifyUrl = process.env.ESEWA_VERIFY_URL;
//       if (!esewaVerifyUrl) {
//         console.error("ESEWA_VERIFY_URL not configured");
//         return NextResponse.json(
//           { status: "error", message: "eSewa verification not configured" },
//           { status: 500 }
//         );
//       }

//       try {
//         // Call eSewa API to verify transaction
//         const verifyUrl = `${esewaVerifyUrl}?product_code=${encodeURIComponent(
//           process.env.ESEWA_MERCHANT_CODE!
//         )}&total_amount=${encodeURIComponent(
//           decoded.total_amount
//         )}&transaction_uuid=${encodeURIComponent(decoded.transaction_uuid)}`;

//         console.log("Verifying with eSewa...");

//         const verifyResponse = await fetch(verifyUrl, {
//           method: "GET",
//         });

//         if (!verifyResponse.ok) {
//           console.error("eSewa verification failed:", verifyResponse.status);
//           return NextResponse.json(
//             {
//               status: "error",
//               message: "Payment verification failed with eSewa",
//             },
//             { status: 400 }
//           );
//         }

//         const verificationResult = await verifyResponse.json();

//         // Verify transaction UUID matches
//         if (
//           verificationResult.status !== "COMPLETE" ||
//           verificationResult.transaction_uuid !== decoded.transaction_uuid
//         ) {
//           console.error("eSewa verification mismatch:", verificationResult);
//           return NextResponse.json(
//             {
//               status: "error",
//               message: "Payment verification failed - invalid transaction",
//             },
//             { status: 400 }
//           );
//         }

//         // Verify amount matches
//         const verifiedAmount = Number(verificationResult.total_amount);
//         const existingAmount = Number(existingPayment.amount);
//         if (Math.abs(verifiedAmount - existingAmount) > 0.01) {
//           console.error("Amount mismatch:", {
//             expected: existingAmount,
//             received: verifiedAmount,
//           });
//           return NextResponse.json(
//             { status: "error", message: "Payment amount mismatch" },
//             { status: 400 }
//           );
//         }

//         console.log("eSewa transaction verified successfully");

//         // Check if transaction UUID was already used (fraud prevention)
//         const existingPaymentWithTxn = await prisma.payments.findFirst({
//           where: {
//             esewaTransactionUuid: decoded.transaction_uuid,
//             id: { not: paymentId },
//           },
//         });

//         if (existingPaymentWithTxn) {
//           console.error("FRAUD ALERT: eSewa transaction UUID already used:", {
//             transaction_uuid: decoded.transaction_uuid,
//             originalPayment: existingPaymentWithTxn.id,
//             attemptedPayment: paymentId,
//           });
//           return NextResponse.json(
//             {
//               status: "error",
//               message: "Transaction already used for another payment",
//             },
//             { status: 400 }
//           );
//         }
//       } catch (verifyError) {
//         console.error("eSewa verification error:", verifyError);
//         return NextResponse.json(
//           { status: "error", message: "Payment verification failed" },
//           { status: 500 }
//         );
//       }

//       // Use atomic update to prevent race condition
//       const updateResult = await prisma.payments.updateMany({
//         where: {
//           id: paymentId,
//           paymentStatus: { not: PaymentStatus.COMPLETED },
//           esewaTransactionUuid: null,
//         },
//         data: {
//           paymentStatus: PaymentStatus.COMPLETED,
//           esewaTransactionUuid: decoded.transaction_uuid,
//           esewaRefId: decoded.ref_id || null,
//         },
//       });

//       if (updateResult.count === 0) {
//         console.log("eSewa payment already processed by another request");
//         return NextResponse.json(
//           { status: "error", message: "Payment has already been processed" },
//           { status: 400 }
//         );
//       }

//       // Update order status to processing
//       await prisma.orders.update({
//         where: { id: existingPayment.order_id },
//         data: { status: "processing" },
//       });

//       console.log("eSewa payment verified and order updated");
//       return NextResponse.json({
//         status: "success",
//         message: "Payment verified successfully",
//         orderId: existingPayment.order_id,
//       });
//     }

//     // Khalti Payment Verification
//     if (method === "khalti") {
//       console.log("Processing KHALTI payment...");
//       const khaltiPidx = pidx || searchParams.get("transaction_id");

//       if (!khaltiPidx) {
//         return NextResponse.json(
//           { status: "error", message: "Missing Khalti transaction details" },
//           { status: 400 }
//         );
//       }

//       // Check if payment exists
//       const existingPayment = await prisma.payments.findUnique({
//         where: { id: paymentId },
//         select: {
//           paymentStatus: true,
//           amount: true,
//           khaltiPidx: true,
//           order_id: true,
//         },
//       });

//       if (!existingPayment) {
//         console.error("Payment record not found");
//         return NextResponse.json(
//           { status: "error", message: "Payment not found" },
//           { status: 404 }
//         );
//       }

//       // Prevent payment reuse
//       if (existingPayment.paymentStatus === PaymentStatus.COMPLETED) {
//         console.error("Payment already processed", { paymentId });
//         return NextResponse.json(
//           { status: "error", message: "Payment has already been processed" },
//           { status: 400 }
//         );
//       }

//       try {
//         const khaltiVerifyUrl = process.env.KHALTI_VERIFY_URL;
//         if (!khaltiVerifyUrl) {
//           console.error("KHALTI_VERIFY_URL not configured");
//           return NextResponse.json(
//             {
//               status: "error",
//               message: "Khalti verification not configured",
//             },
//             { status: 500 }
//           );
//         }

//         // Call Khalti API to verify payment
//         const res = await fetch(khaltiVerifyUrl, {
//           method: "POST",
//           headers: {
//             Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ pidx: khaltiPidx }),
//         });

//         if (!res.ok) {
//           console.error("Khalti verification API failed:", res.status);
//           return NextResponse.json(
//             {
//               status: "error",
//               message: "Payment verification failed with Khalti",
//             },
//             { status: 400 }
//           );
//         }

//         const json = await res.json();
//         console.log("Khalti verification response received");

//         // Verify the pidx belongs to this payment
//         if (json.purchase_order_id && json.purchase_order_id !== paymentId) {
//           console.error("Payment ID mismatch:", {
//             expected: paymentId,
//             received: json.purchase_order_id,
//           });
//           return NextResponse.json(
//             {
//               status: "error",
//               message: "Payment verification failed - ID mismatch",
//             },
//             { status: 400 }
//           );
//         }

//         // Verify amount matches (Khalti returns amount in paisa)
//         if (json.total_amount) {
//           const verifiedAmount = json.total_amount / 100;
//           const existingAmount = Number(existingPayment.amount);
//           if (Math.abs(verifiedAmount - existingAmount) > 0.01) {
//             console.error("Amount mismatch:", {
//               expected: existingAmount,
//               received: verifiedAmount,
//             });
//             return NextResponse.json(
//               { status: "error", message: "Payment amount mismatch" },
//               { status: 400 }
//             );
//           }
//         }

//         // Check payment status
//         if (json.status !== "Completed" && json.state?.name !== "Completed") {
//           console.warn(
//             "Khalti payment not completed:",
//             json.status || json.state?.name
//           );
//           return NextResponse.json(
//             { status: "error", message: "Payment not completed" },
//             { status: 400 }
//           );
//         }

//         console.log("Khalti payment verified successfully");

//         // Check if pidx was already used (fraud prevention)
//         const existingPaymentWithPidx = await prisma.payments.findFirst({
//           where: {
//             khaltiPidx: khaltiPidx,
//             id: { not: paymentId },
//           },
//         });

//         if (existingPaymentWithPidx) {
//           console.error("FRAUD ALERT: Khalti pidx already used:", {
//             pidx: khaltiPidx,
//             originalPayment: existingPaymentWithPidx.id,
//             attemptedPayment: paymentId,
//           });
//           return NextResponse.json(
//             {
//               status: "error",
//               message: "Transaction already used for another payment",
//             },
//             { status: 400 }
//           );
//         }

//         // Update payment record
//         await prisma.payments.update({
//           where: { id: paymentId },
//           data: {
//             paymentStatus: PaymentStatus.COMPLETED,
//             khaltiPidx: khaltiPidx,
//             khaltiTransactionId: json.transaction_id || null,
//           },
//         });

//         // Update order status to processing
//         await prisma.orders.update({
//           where: { id: existingPayment.order_id },
//           data: { status: "processing" },
//         });

//         console.log("Khalti payment verified and order updated");
//         return NextResponse.json({
//           status: "success",
//           message: "Payment verified successfully",
//           orderId: existingPayment.order_id,
//         });
//       } catch (err) {
//         console.error("Khalti verification error:", err);
//         return NextResponse.json(
//           { status: "error", message: "Payment verification failed" },
//           { status: 500 }
//         );
//       }
//     }

//     return NextResponse.json(
//       { status: "error", message: "Invalid payment method" },
//       { status: 400 }
//     );
//   } catch (error) {
//     console.error("Payment verification error:", error);
//     return NextResponse.json(
//       {
//         status: "error",
//         message: "Payment verification failed",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }