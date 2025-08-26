import { IPaymentService } from "../interfaces/notification.service.interface";
import { IPaymentRepository } from "../interfaces/notification.repository.interface";
import { ServiceResponse } from "../../../interfaces/interface";
import { InitiatePaymentDto, PaymentCallbackDto, RefundPaymentDto } from "../dtos/dto";
import mongoose from "mongoose";

export class PaymentService implements IPaymentService {
  constructor(private readonly paymentRepo: IPaymentRepository) {}
  
  async initiatePayment(paymentData: InitiatePaymentDto): Promise<ServiceResponse> {
    try {
      // Generate payment ID
      const paymentId = `PAY${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      // Convert string IDs to ObjectId
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
      
      // Create payment record
      const payment = await this.paymentRepo.create(paymentPayload);
      
      if (!payment) {
        throw new Error("Failed to create payment record");
      }
      
      // TODO: Integrate with actual payment gateway
      // const gatewayResponse = await this.callPaymentGateway(payment);
      
      // For now, return mock gateway URL
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
  
  async processPaymentCallback(
    paymentId: string,
    gatewayResponse: any
  ): Promise<ServiceResponse> {
    try {
      const payment = await this.paymentRepo.findByPaymentId(paymentId);
      
      if (!payment) {
        throw new Error("Payment not found");
      }
      
      // Determine status from gateway response
      const status = gatewayResponse.status === "success" ? "completed" : "failed";
      
      // Update payment status
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
      
      // Update payment with refund details
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
      
      // Reset status to pending
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
