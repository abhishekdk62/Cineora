import { IPaymentService } from "../interfaces/payment.service.interface";
import { IPaymentRepository } from "../interfaces/payment.repository.interface";
import { ServiceResponse } from "../../../interfaces/interface";
import Razorpay from 'razorpay';
import crypto from 'crypto';

import { InitiatePaymentDto, PaymentCallbackDto, RefundPaymentDto } from "../dtos/dto";
import mongoose from "mongoose";
import { config } from "../../../config";

export class PaymentService implements IPaymentService {
    private razorpay: Razorpay;

  constructor(private readonly paymentRepo: IPaymentRepository) {
    this.razorpay = new Razorpay({
      key_id: config.razorpayKeyId!,
      key_secret: config.razorpaySecret!,
    });
    
  }

  async initiatePayment(paymentData: InitiatePaymentDto): Promise<ServiceResponse> {
    try {
      const paymentId = `PAY${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      const paymentPayload = {
        paymentId,
        bookingId: new mongoose.Types.ObjectId(paymentData.bookingId),
        userId: new mongoose.Types.ObjectId(paymentData.userId),
        amount: paymentData.amount,
        currency: paymentData.currency || "INR",
        paymentMethod: paymentData.paymentMethod,
        paymentGateway: paymentData.paymentGateway,
        status: "pending" as const,
        initiatedAt: new Date(),
      };
      
      
      const payment = await this.paymentRepo.create(paymentPayload);
      
      if (!payment) {

        throw new Error("Failed to create payment record");
      }
      
      // TODO: Integrate with actual payment gateway
      const mockGatewayUrl = `https://checkout.razorpay.com/v1/checkout?payment_id=${paymentId}`;
      
      return {
        success: true,
        message: "Payment initiated successfully",
        data: {
          paymentId,
          gatewayUrl: mockGatewayUrl,
          payment,
        },
      };
      
    } catch (error: any) {
      return {

        success: false,
        message: error.message || "Failed to initiate payment",
        data: null,
      };
    }
  }
    async createRazorpayOrder(orderData: { amount: number; currency?: string }): Promise<ServiceResponse> {
    try {
      const options = {
        amount: orderData.amount, 
        currency: orderData.currency || 'INR',
        receipt: `receipt_${Date.now()}`,
      };

      const order = await this.razorpay.orders.create(options);
      
      return {
        success: true,
        message: 'Order created successfully',
        data: order,
      };

    } catch (error: any) {

      return {
        success: false,
        message: error.message || 'Failed to create Razorpay order',
        data: null,
      };
    }
  }

  async verifyRazorpayPayment(paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    bookingData: any;
  }): Promise<ServiceResponse> {
    try {
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
      } = paymentData;

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature === razorpay_signature) {
        return {
          success: true,
          message: 'Payment verified successfully',
          data: {
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
            verified: true
          }
        };
      } else {
        return {
          success: false,
          message: 'Payment verification failed',
          data: null,
        };
      }

    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Payment verification failed',
        data: null,
      };
    }
  }


  async processPaymentCallback(
    paymentId: string,
    gatewayResponse: any
  ): Promise<ServiceResponse> {
    try {
      const payment = await this.paymentRepo.findByPaymentId(paymentId);
      
      if (!payment) {
        throw new Error("Payment not found");
      }
      
      const status = gatewayResponse.status === "success" ? "completed" : "failed";
      
      const updatedPayment = await this.paymentRepo.updateStatus(
        paymentId,
        status,
        {
          gatewayTransactionId: gatewayResponse.transactionId,
          gatewayResponse: gatewayResponse,
          processingTime: Date.now() - payment.initiatedAt.getTime(),
        }
      );
      
      return {
        success: true,
        message: `Payment ${status}`,
        data: updatedPayment,
      };
      
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to process payment callback",
        data: null,
      };
    }
  }
  
  async getPaymentById(paymentId: string): Promise<ServiceResponse> {
    try {
      const payment = await this.paymentRepo.findByPaymentId(paymentId);
      
      if (!payment) {
        return {
          success: false,
          message: "Payment not found",
          data: null,
        };
      }
      
      return {
        success: true,
        message: "Payment found",
        data: payment,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get payment",
        data: null,
      };
    }
  }
  
  async getUserPayments(userId: string): Promise<ServiceResponse> {
    try {
      const payments = await this.paymentRepo.findByUserId(userId);
      
      return {
        success: true,
        message: "User payments retrieved successfully",
        data: payments,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get user payments",
        data: null,
      };
    }
  }
  
  async refundPayment(
    paymentId: string,
    refundAmount: number,
    refundReason: string
  ): Promise<ServiceResponse> {
    try {
      const payment = await this.paymentRepo.findByPaymentId(paymentId);
      
      if (!payment) {
        throw new Error("Payment not found");
      }
      
      if (payment.status !== "completed") {
        throw new Error("Only completed payments can be refunded");
      }
      
      if (refundAmount > payment.amount) {
        throw new Error("Refund amount cannot exceed payment amount");
      }
      
      // TODO: Call payment gateway refund API
      
      const refundedPayment = await this.paymentRepo.createRefund(
        paymentId,
        refundAmount,
        refundReason
      );
      
      return {
        success: true,
        message: "Payment refunded successfully",
        data: refundedPayment,
      };
      
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to refund payment",
        data: null,
      };
    }
  }
  
  async getPaymentsByBooking(bookingId: string): Promise<ServiceResponse> {
    try {
      const payments = await this.paymentRepo.findByBookingId(bookingId);
      
      return {
        success: true,
        message: "Booking payments retrieved successfully",
        data: payments,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get booking payments",
        data: null,
      };
    }
  }
  
  async cancelPayment(paymentId: string): Promise<ServiceResponse> {
    try {
      const updatedPayment = await this.paymentRepo.updateStatus(
        paymentId,
        "cancelled"
      );
      
      if (!updatedPayment) {
        throw new Error("Payment not found");
      }
      
      return {
        success: true,
        message: "Payment cancelled successfully",
        data: updatedPayment,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to cancel payment",
        data: null,
      };
    }
  }
  
  async verifyPayment(
    paymentId: string,
    gatewayTransactionId: string
  ): Promise<ServiceResponse> {
    try {
      // TODO: Call payment gateway verification API
      
      const payment = await this.paymentRepo.findByPaymentId(paymentId);
      
      if (!payment) {
        throw new Error("Payment not found");
      }
      
      return {
        success: true,
        message: "Payment verified successfully",
        data: payment,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to verify payment",
        data: null,
      };
    }
  }
  
  async getPaymentStatus(paymentId: string): Promise<ServiceResponse> {
    return this.getPaymentById(paymentId);
  }
  
  async retryPayment(paymentId: string): Promise<ServiceResponse> {
    try {
      const payment = await this.paymentRepo.findByPaymentId(paymentId);
      
      if (!payment) {
        throw new Error("Payment not found");
      }
      
      if (payment.status !== "failed") {
        throw new Error("Only failed payments can be retried");
      }
      
      const updatedPayment = await this.paymentRepo.updateStatus(
        paymentId,
        "pending"
      );
      
      return {
        success: true,
        message: "Payment retry initiated",
        data: updatedPayment,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to retry payment",
        data: null,
      };
    }
  }
  
  async getFailedPayments(): Promise<ServiceResponse> {
    try {
      const payments = await this.paymentRepo.findFailedPayments();
      
      return {
        success: true,
        message: "Failed payments retrieved successfully",
        data: payments,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get failed payments",
        data: null,
      };
    }
  }
  
  async getPendingPayments(): Promise<ServiceResponse> {
    try {
      const payments = await this.paymentRepo.findPendingPayments();
      
      return {
        success: true,
        message: "Pending payments retrieved successfully",
        data: payments,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get pending payments",
        data: null,
      };
    }
  }
}
