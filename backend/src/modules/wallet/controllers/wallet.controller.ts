import { Request, Response } from "express";
import { IWalletService } from "../interfaces/wallet.service.interface";
import { IWalletTransactionService } from "../../walletTransaction/interfaces/walletTransaction.service.interface";
import { CreateWalletDto, CreditWalletDto, DebitWalletDto } from "../dtos/dto";
import { StatusCodes } from "../../../utils/statuscodes";
import { WALLET_MESSAGES } from "../../../utils/messages.constants";
import { createResponse } from "../../../utils/createResponse";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role?: string };
  owner?: { ownerId: string; role?: string };
}

export class WalletController {
  constructor(
    private readonly walletService: IWalletService,
    private readonly walletTransactionService: IWalletTransactionService
  ) {}

  async createWallet(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { userModel } = req.body;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(createResponse({
          success: false,
          message: WALLET_MESSAGES.USER_AUTH_REQUIRED,
        }));
        return;
      }

      const createDto: CreateWalletDto = {
        userId,
        userModel
      };

      const result = await this.walletService.createWallet(createDto);

      if (result.success) {
        res.status(StatusCodes.CREATED).json(result);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(result);
      }
    } catch (error: unknown) {
      this._handleControllerError(res, error, WALLET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getWalletBalance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userInfo = this._extractUserInfo(req);

      if (!userInfo) {
        res.status(StatusCodes.UNAUTHORIZED).json(createResponse({
          success: false,
          message: WALLET_MESSAGES.USER_AUTH_REQUIRED,
        }));
        return;
      }

      const result = await this.walletService.getWalletBalance(userInfo.userId, userInfo.userModel);

      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      this._handleControllerError(res, error, WALLET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async creditWallet(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { amount, userModel } = req.body;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(createResponse({
          success: false,
          message: WALLET_MESSAGES.USER_AUTH_REQUIRED,
        }));
        return;
      }

      const creditDto: CreditWalletDto = {
        userId,
        userModel,
        amount: parseFloat(amount)
      };

      const result = await this.walletService.creditWallet(creditDto);

      if (result.success) {
        res.status(StatusCodes.OK).json(result);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(result);
      }
    } catch (error: unknown) {
      this._handleControllerError(res, error, WALLET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async debitWallet(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { amount, userModel } = req.body;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(createResponse({
          success: false,
          message: WALLET_MESSAGES.USER_AUTH_REQUIRED,
        }));
        return;
      }

      const debitDto: DebitWalletDto = {
        userId,
        userModel,
        amount: parseFloat(amount)
      };

      const result = await this.walletService.debitWallet(debitDto);

      if (result.success) {
        res.status(StatusCodes.OK).json(result);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(result);
      }
    } catch (error: unknown) {
      this._handleControllerError(res, error, WALLET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async handleWalletTransaction(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userInfo = this._extractUserInfo(req);

      if (!userInfo) {
        res.status(StatusCodes.UNAUTHORIZED).json(createResponse({
          success: false,
          message: WALLET_MESSAGES.USER_AUTH_REQUIRED,
        }));
        return;
      }

      const { amount, type, description } = req.body;

      // Validate request data
      const validationError = this._validateTransactionRequest(amount, type);
      if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: validationError,
        }));
        return;
      }

      const parsedAmount = parseFloat(amount);
      let result;

      if (type === "credit") {
        const creditDto: CreditWalletDto = {
          userId: userInfo.userId,
          userModel: userInfo.userModel,
          amount: parsedAmount,
          description
        };
        result = await this.walletService.creditWallet(creditDto);
      } else {
        const debitDto: DebitWalletDto = {
          userId: userInfo.userId,
          userModel: userInfo.userModel,
          amount: parsedAmount,
          description
        };
        result = await this.walletService.debitWallet(debitDto);
      }

      if (result.success) {
        // Create wallet transaction record
        await this._createWalletTransactionRecord(
          userInfo.userId,
          userInfo.userModel,
          result.data,
          type,
          parsedAmount,
          description
        );

        res.status(StatusCodes.OK).json(createResponse({
          success: true,
          message: result.message,
          data: {
            wallet: result.data,
            userModel: userInfo.userModel,
            transactionType: type,
            amount: parsedAmount,
          },
        }));
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(result);
      }
    } catch (error: unknown) {
      console.error("Wallet transaction error:", error);
      this._handleControllerError(res, error, WALLET_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  // Private helper methods for controller logic (SRP - Single Responsibility)
  private _extractUserInfo(req: AuthenticatedRequest): { userId: string; userModel: "User" | "Owner" } | null {
    if (req.user?.id) {
      return {
        userId: req.user.id,
        userModel: "User"
      };
    }

    if (req.owner?.ownerId) {
      return {
        userId: req.owner.ownerId,
        userModel: "Owner"
      };
    }

    return null;
  }

  private _validateTransactionRequest(amount: string, type: string): string | null {
    if (!amount || !type) {
      return WALLET_MESSAGES.AMOUNT_TYPE_REQUIRED;
    }

    if (!["credit", "debit"].includes(type)) {
      return WALLET_MESSAGES.INVALID_TRANSACTION_TYPE;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return WALLET_MESSAGES.AMOUNT_MUST_BE_POSITIVE;
    }

    return null;
  }

  private async _createWalletTransactionRecord(
    userId: string,
    userModel: "User" | "Owner",
    walletData: any,
    type: string,
    amount: number,
    description?: string
  ): Promise<void> {
    try {
      const transactionResult = await this.walletTransactionService.createWalletTransaction({
        userId: userId,
        userModel: userModel,
        walletId: walletData._id,
        type: type as "credit" | "debit",
        amount: amount,
        category: type === "credit" ? "topup" : "withdrawal",
        description: description || `Wallet ${type} transaction`,
      });

      if (!transactionResult.success) {
        console.error("Failed to create transaction record:", transactionResult.message);
      }
    } catch (error) {
      console.error("Error creating wallet transaction record:", error);
    }
  }

  private _handleControllerError(res: Response, error: unknown, defaultMessage: string): void {
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createResponse({
      success: false,
      message: errorMessage,
    }));
  }
}
