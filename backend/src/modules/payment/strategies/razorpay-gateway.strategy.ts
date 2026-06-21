import Razorpay from "razorpay";
import crypto from "crypto";
import { config } from "../../../config";
import { CreateRazorpayOrderDTO } from "../dtos/dto";
import {
  IPaymentGatewayStrategy,
  PaymentGatewayOrder,
} from "./payment-gateway.strategy.interface";

export class RazorpayGatewayStrategy implements IPaymentGatewayStrategy {
  readonly gatewayName = "razorpay";
  private readonly _client: Razorpay;

  constructor() {
    this._client = new Razorpay({
      key_id: config.razorpayKeyId!,
      key_secret: config.razorpaySecret!,
    });
  }

  async createOrder(orderData: CreateRazorpayOrderDTO): Promise<PaymentGatewayOrder> {
    const order = await this._client.orders.create({
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return order as unknown as PaymentGatewayOrder;
  }

  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", config.razorpaySecret!)
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  }
}
