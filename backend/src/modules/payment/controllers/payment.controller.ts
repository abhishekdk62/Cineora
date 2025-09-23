import { Request, Response } from "express";
import { IPaymentService } from "../interfaces/payment.service.interface";
import {
  InitiatePaymentDTO,
  PaymentCallbackDTO,
  RefundPaymentDTO,
  CreateRazorpayOrderDTO,
  VerifyRazorpayPaymentDTO
} from "../dtos/dto";
import { INotificationService } from "../../notification/interfaces/notification.service.interface";
import { StatusCodes } from "../../../utils/statuscodes";
import { PAYMENT_MESSAGES } from "../../../utils/messages.constants";
import { createResponse } from "../../../utils/createResponse";

export class PaymentController {
  constructor(
    private readonly _paymentService: IPaymentService,
    private readonly _notificationService: INotificationService
  ) {}

  async initiatePayment(req: Request, res: Response): Promise<void> {
    try {
      const paymentData: InitiatePaymentDTO = req.body;
      
      const result = await this._paymentService.initiatePayment(paymentData);

      if (result.success) {
        res.status(StatusCodes.CREATED).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : PAYMENT_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async createRazorpayOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderData: CreateRazorpayOrderDTO = {
        amount: req.body.amount,
        currency: req.body.currency || "INR",
      };

      const result = await this._paymentService.createRazorpayOrder(orderData);

      if (result.success) {
        res.status(StatusCodes.CREATED).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : PAYMENT_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async verifyRazorpayPayment(req: Request, res: Response): Promise<void> {
    try {
      const verificationData: VerifyRazorpayPaymentDTO = {
        razorpay_payment_id: req.body.razorpay_payment_id,
        razorpay_order_id: req.body.razorpay_order_id,
        razorpay_signature: req.body.razorpay_signature,
        bookingData: req.body.bookingData,
      };

      const result = await this._paymentService.verifyRazorpayPayment(verificationData);

      if (result.data && result.data.userId) {
        const notificationData = {
          amount: result.data.amount,
          status: result.success ? "completed" : "failed",
          paymentMethod: "razorpay",
        };

     
      }

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error: unknown) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : PAYMENT_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async processPaymentCallback(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;
      const gatewayResponse: PaymentCallbackDTO = req.body;

      const result = await this._paymentService.processPaymentCallback(paymentId, gatewayResponse);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : PAYMENT_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
  

 

  async getPaymentById(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;
      const result = await this._paymentService.getPaymentById(paymentId);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : PAYMENT_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async getUserPayments(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const result = await this._paymentService.getUserPayments(userId);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : PAYMENT_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async refundPayment(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;
      const { refundAmount, refundReason } = req.body;

      const result = await this._paymentService.refundPayment(paymentId, refundAmount, refundReason);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : PAYMENT_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async getPaymentsByBooking(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const result = await this._paymentService.getPaymentsByBooking(bookingId);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : PAYMENT_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async cancelPayment(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;
      const result = await this._paymentService.cancelPayment(paymentId);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : PAYMENT_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;
      const { gatewayTransactionId } = req.body;

      const result = await this._paymentService.verifyPayment(paymentId, gatewayTransactionId);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : PAYMENT_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
//!payout 
//!payout 
//!payout 
//!payout 
//!payout 


  async createPayoutOrder(req: Request, res: Response): Promise<void> {
    try {
      const { amount, mode, purpose } = req.body;
      const ownerId = req.owner?.ownerId;

      console.log(' Creating payout order:', { ownerId, amount, mode, purpose });

      if (!amount || amount < 100) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: 'Minimum payout amount is ₹100'
          })
        );
        return;
      }

      const result = await this._paymentService.createPayoutOrder({
        ownerId,
        amount,
        mode,
        purpose
      });

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: 'Payout order created successfully',
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message
          })
        );
      }

    } catch (error: unknown) {
      console.error(' Create payout order error:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: 'Failed to create payout order'
        })
      );
    }
  }

  async confirmPayout(req: Request, res: Response): Promise<void> {
    try {
      const { razorpay_payment_id, amount, mode, order_id } = req.body;
      const ownerId = req.owner?.ownerId;

      console.log('✅ Confirming payout:', { 
        ownerId, 
        amount, 
        mode, 
        razorpay_payment_id,
        order_id 
      });

      // Process payout confirmation
      const result = await this._paymentService.confirmPayout({
        ownerId,
        amount,
        mode,
        razorpay_payment_id,
        order_id
      });

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: 'Payout confirmed! Money will be transferred to your account.',
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message
          })
        );
      }

    } catch (error: unknown) {
      console.error(' Confirm payout error:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: 'Failed to confirm payout'
        })
      );
    }
  }









  async getPaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;
      const result = await this._paymentService.getPaymentStatus(paymentId);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : PAYMENT_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async retryPayment(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;
      const result = await this._paymentService.retryPayment(paymentId);

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : PAYMENT_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async getFailedPayments(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._paymentService.getFailedPayments();

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : PAYMENT_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  async getPendingPayments(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._paymentService.getPendingPayments();

      const statusCode = result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      res.status(statusCode).json(
        createResponse({
          success: result.success,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error instanceof Error ? error.message : PAYMENT_MESSAGES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
}
