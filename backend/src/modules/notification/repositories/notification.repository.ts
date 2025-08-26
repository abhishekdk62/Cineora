import { IPayment } from "../interfaces/notification.model.interface";
import Payment from "../models/notification.model";
import { IPaymentRepository } from "../interfaces/notification.repository.interface";

export class PaymentRepository implements IPaymentRepository {
  async create(paymentData: Partial<IPayment>): Promise<IPayment | null> {
    const payment = new Payment(paymentData);
    return payment.save();
  }
  
  async findById(id: string): Promise<IPayment | null> {
    return Payment.findById(id)
      .populate("bookingId")
      .populate("userId", "firstName lastName email");
  }
  
  async findByPaymentId(paymentId: string): Promise<IPayment | null> {
    return Payment.findOne({ paymentId })
      .populate("bookingId")
      .populate("userId", "firstName lastName email");
  }
  
  async findByBookingId(bookingId: string): Promise<IPayment[]> {
    return Payment.find({ bookingId })
      .populate("userId", "firstName lastName email")
      .sort({ initiatedAt: -1 });
  }
  
  async findByUserId(userId: string): Promise<IPayment[]> {
    return Payment.find({ userId })
      .populate("bookingId")
      .sort({ initiatedAt: -1 });
  }
  
  async updateById(
    id: string,
    updateData: Partial<IPayment>
  ): Promise<IPayment | null> {
    return Payment.findByIdAndUpdate(id, updateData, { new: true });
  }
  
  async updateByPaymentId(
    paymentId: string,
    updateData: Partial<IPayment>
  ): Promise<IPayment | null> {
    return Payment.findOneAndUpdate({ paymentId }, updateData, { new: true });
  }
  
  async updateStatus(
    paymentId: string,
    status: string,
    transactionDetails?: any
  ): Promise<IPayment | null> {
    const updateData: any = { 
      status,
      completedAt: status === "completed" ? new Date() : undefined
    };
    
    if (transactionDetails) {
      updateData.transactionDetails = transactionDetails;
    }
    
    return Payment.findOneAndUpdate({ paymentId }, updateData, { new: true });
  }
  
  async findByStatus(status: string): Promise<IPayment[]> {
    return Payment.find({ status })
      .populate("bookingId")
      .populate("userId", "firstName lastName email")
      .sort({ initiatedAt: -1 });
  }
  
  async findPendingPayments(): Promise<IPayment[]> {
    return Payment.find({ 
      status: { $in: ["pending", "processing"] }
    })
      .populate("bookingId")
      .populate("userId", "firstName lastName email")
      .sort({ initiatedAt: -1 });
  }
  
  async findFailedPayments(): Promise<IPayment[]> {
    return Payment.find({ status: "failed" })
      .populate("bookingId")
      .populate("userId", "firstName lastName email")
      .sort({ initiatedAt: -1 });
  }
  
  async createRefund(
    paymentId: string,
    refundAmount: number,
    refundReason: string
  ): Promise<IPayment | null> {
    return Payment.findOneAndUpdate(
      { paymentId },
      {
        status: "refunded",
        refundAmount,
        refundReason,
        refundDate: new Date(),
      },
      { new: true }
    );
  }
  
  async findRefundablePayments(): Promise<IPayment[]> {
    return Payment.find({
      status: "completed",
      refundAmount: { $exists: false }
    })
      .populate("bookingId")
      .populate("userId", "firstName lastName email");
  }
  
  async deleteById(id: string): Promise<boolean> {
    const result = await Payment.findByIdAndDelete(id);
    return !!result;
  }
}
