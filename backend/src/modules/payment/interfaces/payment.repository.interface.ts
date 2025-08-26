import { IPayment } from "./payment.model.interface";

export interface IPaymentRepository {
  create(paymentData: Partial<IPayment>): Promise<IPayment | null>;
  
  findById(id: string): Promise<IPayment | null>;
  
  findByPaymentId(paymentId: string): Promise<IPayment | null>;
  
  findByBookingId(bookingId: string): Promise<IPayment[]>;
  
  findByUserId(userId: string): Promise<IPayment[]>;
  
  updateById(
    id: string,
    updateData: Partial<IPayment>
  ): Promise<IPayment | null>;
  
  updateByPaymentId(
    paymentId: string,
    updateData: Partial<IPayment>
  ): Promise<IPayment | null>;
  
  updateStatus(
    paymentId: string,
    status: string,
    transactionDetails?: any
  ): Promise<IPayment | null>;
  
  findByStatus(status: string): Promise<IPayment[]>;
  
  findPendingPayments(): Promise<IPayment[]>;
  
  findFailedPayments(): Promise<IPayment[]>;
  
  createRefund(
    paymentId: string,
    refundAmount: number,
    refundReason: string
  ): Promise<IPayment | null>;
  
  findRefundablePayments(): Promise<IPayment[]>;
  
  deleteById(id: string): Promise<boolean>;
}
