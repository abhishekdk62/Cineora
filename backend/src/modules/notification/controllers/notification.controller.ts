import { Request, Response } from "express";
import { PaymentService } from "../services/notification.service";
import { IPaymentService } from "../interfaces/notification.service.interface";
import { InitiatePaymentDto, PaymentCallbackDto, RefundPaymentDto } from "../dtos/dto";

export class PaymentController {
  constructor(private readonly paymentService: IPaymentService) {}
  
  async initiatePayment(req: Request, res: Response): Promise<any> {
    try {
      const paymentDto: InitiatePaymentDto = req.body;
      const result = await this.paymentService.initiatePayment(paymentDto);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async paymentCallback(req: Request, res: Response): Promise<any> {
    try {
      const { paymentId } = req.params;
      const gatewayResponse = req.body;
      
      const result = await this.paymentService.processPaymentCallback(
        paymentId,
        gatewayResponse
      );
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async getPaymentById(req: Request, res: Response): Promise<any> {
    try {
      const { paymentId } = req.params;
      const result = await this.paymentService.getPaymentById(paymentId);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async getUserPayments(req: Request, res: Response): Promise<any> {
    try {
      const { userId } = req.params;
      const result = await this.paymentService.getUserPayments(userId);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async refundPayment(req: Request, res: Response): Promise<any> {
    try {
      const { paymentId } = req.params;
      const { refundAmount, refundReason }: RefundPaymentDto = req.body;
      
      const result = await this.paymentService.refundPayment(
        paymentId,
        refundAmount,
        refundReason
      );
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async cancelPayment(req: Request, res: Response): Promise<any> {
    try {
      const { paymentId } = req.params;
      const result = await this.paymentService.cancelPayment(paymentId);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async verifyPayment(req: Request, res: Response): Promise<any> {
    try {
      const { paymentId } = req.params;
      const { gatewayTransactionId } = req.body;
      
      const result = await this.paymentService.verifyPayment(
        paymentId,
        gatewayTransactionId
      );
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
  
  async getPaymentStatus(req: Request, res: Response): Promise<any> {
    try {
      const { paymentId } = req.params;
      const result = await this.paymentService.getPaymentStatus(paymentId);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
}
