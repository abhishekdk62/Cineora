import { IPayment, ITransactionDetails } from "./payment.model.interface";
import { 
  CreatePaymentDTO, 
  UpdatePaymentDTO, 
  PaymentStatusUpdateDTO, 
  RefundPaymentDTO 
} from "../dtos/dto";

export interface IPaymentRepository {
  createPayment(paymentData: CreatePaymentDTO): Promise<IPayment>;
  updatePaymentById(paymentId: string, updateData: UpdatePaymentDTO): Promise<IPayment>;
  updatePaymentByPaymentId(paymentId: string, updateData: UpdatePaymentDTO): Promise<IPayment>;
  updatePaymentStatus(paymentId: string, statusUpdate: PaymentStatusUpdateDTO): Promise<IPayment>;
  createPaymentRefund(paymentId: string, refundData: RefundPaymentDTO): Promise<IPayment>;
  deletePaymentById(paymentId: string): Promise<boolean>;
  createPaymentRecord(paymentData: {
    paymentId: string;
    userId: string;
    amount: number;
    currency: string;
    razorpayOrderId: string;
  }): Promise<IPayment>;

  getLatestVerifiedPayment(
    userId: string
  ): Promise<IPayment | null>;

  getPaymentById(paymentId: string): Promise<IPayment | null>;
  getPaymentByPaymentId(paymentId: string): Promise<IPayment | null>;
  getPaymentsByBookingId(bookingId: string): Promise<IPayment[]>;
  getPaymentsByUserId(userId: string): Promise<IPayment[]>;
  getPaymentsByStatus(status: string): Promise<IPayment[]>;
  getPendingPayments(): Promise<IPayment[]>;
  getFailedPayments(): Promise<IPayment[]>;
  getRefundablePayments(): Promise<IPayment[]>;
}
