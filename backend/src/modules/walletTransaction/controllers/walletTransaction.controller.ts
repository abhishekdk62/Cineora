import { Request, Response } from "express";
import { IWalletTransactionService } from "../interfaces/walletTransaction.service.interface";
import { StatusCodes } from "../../../utils/statuscodes";
import { WALLET_TRANSACTION_MESSAGES } from "../../../utils/messages.constants";
import { createResponse } from "../../../utils/createResponse";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
  owner?: { ownerId: string };
}

export class WalletTransactionController {
  constructor(
    private readonly walletTransactionService: IWalletTransactionService
  ) {}

  async getUserWalletTransactions(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.id || req.owner?.ownerId || req.admin.adminId;
      const { page = 1, limit = 10 } = req.query;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: WALLET_TRANSACTION_MESSAGES.USER_AUTH_REQUIRED,
          })
        );
        return;
      }

      const result =
        await this.walletTransactionService.getUserWalletTransactions(
          userId,
          parseInt(page as string),
          parseInt(limit as string)
        );

      if (result.success && result.data) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data.transactions,
            meta: {
              pagination: {
                currentPage: parseInt(page as string),
                totalPages: result.data.pagination.totalPages,
                total: result.data.pagination.total,
                limit: parseInt(limit as string),
                hasNextPage:
                  parseInt(page as string) < result.data.pagination.totalPages,
                hasPrevPage: parseInt(page as string) > 1,
              },
            },
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
      const errorMessage =
        error instanceof Error
          ? error.message
          : WALLET_TRANSACTION_MESSAGES.INTERNAL_SERVER_ERROR;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: errorMessage,
        })
      );
    }
  }
}
