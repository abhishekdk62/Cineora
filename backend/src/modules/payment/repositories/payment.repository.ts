import { IPayment, ITransactionDetails } from "../interfaces/payment.model.interface";
import Payment from "../models/payment.model";
import { 

  IPaymentRepository 
} from "../interfaces/payment.repository.interface";
import { 
  CreatePaymentDTO, 
  UpdatePaymentDTO, 
  PaymentStatusUpdateDTO, 
  RefundPaymentDTO 
} from "../dtos/dto";

export class PaymentRepository implements IPaymentRepository {
  // Create Operations (IPaymentWriteRepository)
  async createPayment(paymentData: CreatePaymentDTO): Promise<IPayment> {
    try {
      const payment = new Payment(paymentData);
      const savedPayment = await payment.save();
      if (!savedPayment) {
        throw new Error("Failed to create payment");
      }
      return savedPayment;
    } catch (error) {
      throw new Error(`Error creating payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updatePaymentById(paymentId: string, updateData: UpdatePaymentDTO): Promise<IPayment> {
    try {
      const updatedPayment = await Payment.findByIdAndUpdate(paymentId, updateData, { new: true });
      if (!updatedPayment) {
        throw new Error("Payment not found or update failed");
      }
      return updatedPayment;
    } catch (error) {
      throw new Error(`Error updating payment by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updatePaymentByPaymentId(paymentId: string, updateData: UpdatePaymentDTO): Promise<IPayment> {
    try {
      const updatedPayment = await Payment.findOneAndUpdate({ paymentId }, updateData, { new: true });
      if (!updatedPayment) {
        throw new Error("Payment not found or update failed");
      }
      return updatedPayment;
    } catch (error) {
      throw new Error(`Error updating payment by payment ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updatePaymentStatus(paymentId: string, statusUpdate: PaymentStatusUpdateDTO): Promise<IPayment> {
    try {
      const updateData: Partial<IPayment> = {
        status: statusUpdate.status,
        completedAt: statusUpdate.status === "completed" ? new Date() : undefined
      };

      if (statusUpdate.transactionDetails) {
        updateData.transactionDetails = statusUpdate.transactionDetails;
      }

      const updatedPayment = await Payment.findOneAndUpdate({ paymentId }, updateData, { new: true });
      if (!updatedPayment) {
        throw new Error("Payment not found or status update failed");
      }
      return updatedPayment;
    } catch (error) {
      throw new Error(`Error updating payment status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createPaymentRefund(paymentId: string, refundData: RefundPaymentDTO): Promise<IPayment> {
    try {
      const updatedPayment = await Payment.findOneAndUpdate(
        { paymentId },
        {
          status: "refunded",
          refundAmount: refundData.refundAmount,
          refundReason: refundData.refundReason,
          refundDate: new Date(),
          refundTransactionId: refundData.refundTransactionId,
        },
        { new: true }
      );
      if (!updatedPayment) {
        throw new Error("Payment not found or refund creation failed");
      }
      return updatedPayment;
    } catch (error) {
      throw new Error(`Error creating payment refund: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deletePaymentById(paymentId: string): Promise<boolean> {
    try {
      const result = await Payment.findByIdAndDelete(paymentId);
      return !!result;
    } catch (error) {
      throw new Error(`Error deleting payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Read Operations (IPaymentReadRepository)
  async getPaymentById(paymentId: string): Promise<IPayment | null> {
    try {
      return await Payment.findById(paymentId)
        .populate("bookingId")
        .populate("userId", "firstName lastName email");
    } catch (error) {
      throw new Error(`Error fetching payment by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPaymentByPaymentId(paymentId: string): Promise<IPayment | null> {
    try {
      return await Payment.findOne({ paymentId })
        .populate("bookingId")
        .populate("userId", "firstName lastName email");
    } catch (error) {
      throw new Error(`Error fetching payment by payment ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPaymentsByBookingId(bookingId: string): Promise<IPayment[]> {
    try {
      return await Payment.find({ bookingId })
        .populate("userId", "firstName lastName email")
        .sort({ initiatedAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching payments by booking ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPaymentsByUserId(userId: string): Promise<IPayment[]> {
    try {
      return await Payment.find({ userId })
        .populate("bookingId")
        .sort({ initiatedAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching payments by user ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPaymentsByStatus(status: string): Promise<IPayment[]> {
    try {
      return await Payment.find({ status })
        .populate("bookingId")
        .populate("userId", "firstName lastName email")
        .sort({ initiatedAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching payments by status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPendingPayments(): Promise<IPayment[]> {
    try {
      return await Payment.find({
        status: { $in: ["pending", "processing"] }
      })
        .populate("bookingId")
        .populate("userId", "firstName lastName email")
        .sort({ initiatedAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching pending payments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getFailedPayments(): Promise<IPayment[]> {
    try {
      return await Payment.find({ status: "failed" })
        .populate("bookingId")
        .populate("userId", "firstName lastName email")
        .sort({ initiatedAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching failed payments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRefundablePayments(): Promise<IPayment[]> {
    try {
      return await Payment.find({
        status: "completed",
        refundAmount: { $exists: false }
      })
        .populate("bookingId")
        .populate("userId", "firstName lastName email");
    } catch (error) {
      throw new Error(`Error fetching refundable payments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
