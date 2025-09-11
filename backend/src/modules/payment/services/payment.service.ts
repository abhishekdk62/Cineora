import { IPayment } from "../interfaces/payment.model.interface";
import { IPaymentService } from "../interfaces/payment.service.interface";
import { IPaymentRepository } from "../interfaces/payment.repository.interface";
import { ServiceResponse } from "../../../interfaces/interface";
import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from "mongoose";
import { config } from "../../../config";
import {
  InitiatePaymentDTO,
  PaymentCallbackDTO,
  RefundPaymentDTO,
  CreateRazorpayOrderDTO,
  VerifyRazorpayPaymentDTO,
  CreatePaymentDTO,
  PaymentStatusUpdateDTO
} from "../dtos/dto";

export class PaymentService implements IPaymentService {
  private readonly _razorpay: Razorpay;

  constructor(private readonly _paymentRepository: IPaymentRepository) {
    this._razorpay = new Razorpay({
      key_id: config.razorpayKeyId!,
      key_secret: config.razorpaySecret!,
    });
  }

  async initiatePayment(paymentData: InitiatePaymentDTO): Promise<ServiceResponse> {
    try {
      this._validateInitiatePaymentData(paymentData);

      const paymentId = this._generatePaymentId();
      
      const paymentPayload: CreatePaymentDTO = {
        paymentId,
        bookingId: paymentData.bookingId,
        userId: paymentData.userId,
        amount: paymentData.amount,
        currency: paymentData.currency || "INR",
        paymentMethod: paymentData.paymentMethod,
        paymentGateway: paymentData.paymentGateway,
        status: "pending",
        initiatedAt: new Date(),
      };
      
      const payment = await this._paymentRepository.createPayment(paymentPayload);
      
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
      
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to initiate payment",
        data: null,
      };
    }
  }

  async createRazorpayOrder(orderData: CreateRazorpayOrderDTO): Promise<ServiceResponse> {
    try {
      this._validateRazorpayOrderData(orderData);

      const options = {
        amount: orderData.amount, 
        currency: orderData.currency || 'INR',
        receipt: `receipt_${Date.now()}`,
      };

      const order = await this._razorpay.orders.create(options);
      
      return {
        success: true,
        message: 'Order created successfully',
        data: order,
      };

    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create Razorpay order',
        data: null,
      };
    }
  }

  async verifyRazorpayPayment(paymentData: VerifyRazorpayPaymentDTO): Promise<ServiceResponse> {
    try {
      this._validateRazorpayVerificationData(paymentData);

      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
      } = paymentData;

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      
      const expectedSignature = crypto
        .createHmac('sha256', config.razorpaySecret!)
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

    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Payment verification failed',
        data: null,
      };
    }
  }

  async processPaymentCallback(paymentId: string, gatewayResponse: PaymentCallbackDTO): Promise<ServiceResponse> {
    try {
      this._validatePaymentId(paymentId);
      this._validateCallbackData(gatewayResponse);

      const payment = await this._paymentRepository.getPaymentByPaymentId(paymentId);
      
      if (!payment) {
        throw new Error("Payment not found");
      }
      
      const status = gatewayResponse.status === "success" ? "completed" : "failed";
      
      const statusUpdate: PaymentStatusUpdateDTO = {
        status,
        transactionDetails: {
          gatewayTransactionId: gatewayResponse.transactionId,
          gatewayResponse: gatewayResponse,
          processingTime: Date.now() - payment.initiatedAt.getTime(),
        }
      };

      const updatedPayment = await this._paymentRepository.updatePaymentStatus(paymentId, statusUpdate);
      
      return {
        success: true,
        message: `Payment ${status}`,
        data: updatedPayment,
      };
      
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to process payment callback",
        data: null,
      };
    }
  }
  
  async getPaymentById(paymentId: string): Promise<ServiceResponse> {
    try {
      this._validatePaymentId(paymentId);
      
      const payment = await this._paymentRepository.getPaymentByPaymentId(paymentId);
      
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
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to get payment",
        data: null,
      };
    }
  }
  
  async getUserPayments(userId: string): Promise<ServiceResponse> {
    try {
      this._validateUserId(userId);
      
      const payments = await this._paymentRepository.getPaymentsByUserId(userId);
      
      return {
        success: true,
        message: "User payments retrieved successfully",
        data: payments,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to get user payments",
        data: null,
      };
    }
  }
  
  async refundPayment(paymentId: string, refundAmount: number, refundReason: string): Promise<ServiceResponse> {
    try {
      this._validatePaymentId(paymentId);
      this._validateRefundAmount(refundAmount);
      this._validateRefundReason(refundReason);

      const payment = await this._paymentRepository.getPaymentByPaymentId(paymentId);
      
      if (!payment) {
        throw new Error("Payment not found");
      }
      
      this._validateRefundEligibility(payment, refundAmount);
      
      // TODO: Call payment gateway refund API
      
      const refundData: RefundPaymentDTO = {
        refundAmount,
        refundReason
      };

      const refundedPayment = await this._paymentRepository.createPaymentRefund(paymentId, refundData);
      
      return {
        success: true,
        message: "Payment refunded successfully",
        data: refundedPayment,
      };
      
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to refund payment",
        data: null,
      };
    }
  }
  
  async getPaymentsByBooking(bookingId: string): Promise<ServiceResponse> {
    try {
      this._validateBookingId(bookingId);
      
      const payments = await this._paymentRepository.getPaymentsByBookingId(bookingId);
      
      return {
        success: true,
        message: "Booking payments retrieved successfully",
        data: payments,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to get booking payments",
        data: null,
      };
    }
  }
  
  async cancelPayment(paymentId: string): Promise<ServiceResponse> {
    try {
      this._validatePaymentId(paymentId);

      const payment = await this._paymentRepository.getPaymentByPaymentId(paymentId);
      if (!payment) {
        throw new Error("Payment not found");
      }

      this._validateCancellationEligibility(payment);

      const statusUpdate: PaymentStatusUpdateDTO = {
        status: "cancelled"
      };

      const updatedPayment = await this._paymentRepository.updatePaymentStatus(paymentId, statusUpdate);
      
      return {
        success: true,
        message: "Payment cancelled successfully",
        data: updatedPayment,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to cancel payment",
        data: null,
      };
    }
  }
  
  async verifyPayment(paymentId: string, gatewayTransactionId: string): Promise<ServiceResponse> {
    try {
      this._validatePaymentId(paymentId);
      this._validateGatewayTransactionId(gatewayTransactionId);
      
      // TODO: Call payment gateway verification API
      
      const payment = await this._paymentRepository.getPaymentByPaymentId(paymentId);
      
      if (!payment) {
        throw new Error("Payment not found");
      }
      
      return {
        success: true,
        message: "Payment verified successfully",
        data: payment,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to verify payment",
        data: null,
      };
    }
  }
  
  async getPaymentStatus(paymentId: string): Promise<ServiceResponse> {
    return this.getPaymentById(paymentId);
  }
  
  async retryPayment(paymentId: string): Promise<ServiceResponse> {
    try {
      this._validatePaymentId(paymentId);

      const payment = await this._paymentRepository.getPaymentByPaymentId(paymentId);
      
      if (!payment) {
        throw new Error("Payment not found");
      }
      
      this._validateRetryEligibility(payment);

      const statusUpdate: PaymentStatusUpdateDTO = {
        status: "pending"
      };
      
      const updatedPayment = await this._paymentRepository.updatePaymentStatus(paymentId, statusUpdate);
      
      return {
        success: true,
        message: "Payment retry initiated",
        data: updatedPayment,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to retry payment",
        data: null,
      };
    }
  }
  
  async getFailedPayments(): Promise<ServiceResponse> {
    try {
      const payments = await this._paymentRepository.getFailedPayments();
      
      return {
        success: true,
        message: "Failed payments retrieved successfully",
        data: payments,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to get failed payments",
        data: null,
      };
    }
  }
  
  async getPendingPayments(): Promise<ServiceResponse> {
    try {
      const payments = await this._paymentRepository.getPendingPayments();
      
      return {
        success: true,
        message: "Pending payments retrieved successfully",
        data: payments,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to get pending payments",
        data: null,
      };
    }
  }

  private _generatePaymentId(): string {
    return `PAY${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }

  private _validateInitiatePaymentData(data: InitiatePaymentDTO): void {
    if (!data.bookingId || !data.userId) {
      throw new Error("Booking ID and User ID are required");
    }
    if (!data.amount || data.amount <= 0) {
      throw new Error("Valid amount is required");
    }
    if (!data.paymentMethod || !data.paymentGateway) {
      throw new Error("Payment method and gateway are required");
    }
  }

  private _validateRazorpayOrderData(data: CreateRazorpayOrderDTO): void {
    if (!data.amount || data.amount <= 0) {
      throw new Error("Valid amount is required");
    }
  }

  private _validateRazorpayVerificationData(data: VerifyRazorpayPaymentDTO): void {
    if (!data.razorpay_payment_id || !data.razorpay_order_id || !data.razorpay_signature) {
      throw new Error("All Razorpay verification parameters are required");
    }
  }

  private _validatePaymentId(paymentId: string): void {
    if (!paymentId || paymentId.trim() === "") {
      throw new Error("Valid payment ID is required");
    }
  }

  private _validateUserId(userId: string): void {
    if (!userId || userId.trim() === "") {
      throw new Error("Valid user ID is required");
    }
  }

  private _validateBookingId(bookingId: string): void {
    if (!bookingId || bookingId.trim() === "") {
      throw new Error("Valid booking ID is required");
    }
  }

  private _validateRefundAmount(amount: number): void {
    if (!amount || amount <= 0) {
      throw new Error("Valid refund amount is required");
    }
  }

  private _validateRefundReason(reason: string): void {
    if (!reason || reason.trim() === "") {
      throw new Error("Refund reason is required");
    }
  }

  private _validateGatewayTransactionId(transactionId: string): void {
    if (!transactionId || transactionId.trim() === "") {
      throw new Error("Valid gateway transaction ID is required");
    }
  }

  private _validateCallbackData(data: PaymentCallbackDTO): void {
    if (!data.status || !data.transactionId) {
      throw new Error("Valid callback data is required");
    }
  }

  private _validateRefundEligibility(payment: IPayment, refundAmount: number): void {
    if (payment.status !== "completed") {
      throw new Error("Only completed payments can be refunded");
    }
    if (payment.refundAmount) {
      throw new Error("Payment has already been refunded");
    }
    if (refundAmount > payment.amount) {
      throw new Error("Refund amount cannot exceed payment amount");
    }
  }

  private _validateCancellationEligibility(payment: IPayment): void {
    const cancellableStatuses = ["pending", "processing"];
    if (!cancellableStatuses.includes(payment.status)) {
      throw new Error(`Cannot cancel payment with status: ${payment.status}`);
    }
  }

  private _validateRetryEligibility(payment: IPayment): void {
    if (payment.status !== "failed") {
      throw new Error("Only failed payments can be retried");
    }
  }
}
