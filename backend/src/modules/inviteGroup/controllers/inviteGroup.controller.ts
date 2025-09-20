// controllers/inviteGroup.controller.ts
import { Response } from "express";
import { IInviteGroupService } from "../interfaces/inviteGroup.service.interface";
import { InviteGroupFilterDTO } from "../dtos/inviteGroup.dto";
import { INVITE_GROUP_MESSAGES } from "../../../utils/messages.constants";
import { StatusCodes } from "../../../utils/statuscodes";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email?: string;
  };
}

export interface InviteGroupParams {
  inviteId?: string;
}

export interface InviteGroupQuery {
  limit?: string;
  skip?: string;
  minRating?: string;
  showtimeId?: string;
  status?: string;
}

export class InviteGroupController {
  constructor(private inviteGroupService: IInviteGroupService) {}

  async createInviteGroup(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const authenticatedUserId = this._extractAuthenticatedUserId(req);

      if (!authenticatedUserId) {
        return this._sendErrorResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          INVITE_GROUP_MESSAGES.UNAUTHORIZED
        );
      }

      if (!this._validateCreateInviteRequest(req.body)) {
        return this._sendErrorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          INVITE_GROUP_MESSAGES.MISSING_REQUIRED_FIELDS
        );
      }

      const inviteGroup = await this.inviteGroupService.createInviteGroup(
        req.body,
        authenticatedUserId
      );

      return this._sendSuccessResponse(res, StatusCodes.CREATED, {
        message: INVITE_GROUP_MESSAGES.INVITE_GROUP_CREATED,
        data: inviteGroup,
      });
    } catch (error: any) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || INVITE_GROUP_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAvailableInvites(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const authenticatedUserId = this._extractAuthenticatedUserId(req);

      if (!authenticatedUserId) {
        return this._sendErrorResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          INVITE_GROUP_MESSAGES.UNAUTHORIZED
        );
      }

      const filters = this._mapQueryToFilters(req.query as InviteGroupQuery);

      const invites = await this.inviteGroupService.getAvailableInvites(
        authenticatedUserId,
        filters
      );

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        message: INVITE_GROUP_MESSAGES.AVAILABLE_INVITES_RETRIEVED,
        data: invites,
        count: invites.length,
      });
    } catch (error: any) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || INVITE_GROUP_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUserInviteGroups(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const authenticatedUserId = this._extractAuthenticatedUserId(req);

      if (!authenticatedUserId) {
        return this._sendErrorResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          INVITE_GROUP_MESSAGES.UNAUTHORIZED
        );
      }

      const filters = this._mapQueryToFilters(req.query as InviteGroupQuery);

      const inviteGroups = await this.inviteGroupService.getUserInviteGroups(
        authenticatedUserId,
        filters
      );

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        message: INVITE_GROUP_MESSAGES.USER_INVITE_GROUPS_RETRIEVED,
        data: inviteGroups,
        count: inviteGroups.length,
      });
    } catch (error: any) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || INVITE_GROUP_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getInviteGroupById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const authenticatedUserId = this._extractAuthenticatedUserId(req);

      if (!authenticatedUserId) {
        return this._sendErrorResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          INVITE_GROUP_MESSAGES.UNAUTHORIZED
        );
      }

      const { inviteId } = this._mapParamsToInviteGroupParams(req.params);

      if (!inviteId) {
        return this._sendErrorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          INVITE_GROUP_MESSAGES.INVALID_INVITE_ID
        );
      }

      const inviteGroup = await this.inviteGroupService.getInviteGroupById(
        inviteId
      );

      if (!inviteGroup) {
        return this._sendErrorResponse(
          res,
          StatusCodes.NOT_FOUND,
          INVITE_GROUP_MESSAGES.INVITE_GROUP_NOT_FOUND
        );
      }

      return this._sendSuccessResponse(res, StatusCodes.OK, {
        message: INVITE_GROUP_MESSAGES.INVITE_GROUP_RETRIEVED,
        data: inviteGroup,
      });
    } catch (error: any) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || INVITE_GROUP_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async confirmJoinAfterPayment(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const authenticatedUserId = this._extractAuthenticatedUserId(req);

      if (!authenticatedUserId) {
        return this._sendErrorResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          INVITE_GROUP_MESSAGES.UNAUTHORIZED
        );
      }

      const { inviteId, totalAmount, ticketId } = req.body;

      // if (!this._validatePaymentDetails({ inviteId,amount })) {
      //   return this._sendErrorResponse(
      //     res,
      //     StatusCodes.BAD_REQUEST,
      //     INVITE_GROUP_MESSAGES.INVALID_PAYMENT_DETAILS
      //   );
      // }
      let amount = totalAmount;
      const result = await this.inviteGroupService.confirmJoinAfterPayment(
        inviteId,
        authenticatedUserId,
        amount,
        ticketId
      );

      const statusCode = result.success
        ? StatusCodes.OK
        : StatusCodes.BAD_REQUEST;

      return this._sendResponse(res, statusCode, {
        success: result.success,
        message: result.message,
        data: result.inviteGroup,
      });
    } catch (error: any) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || INVITE_GROUP_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async leaveInviteGroup(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const authenticatedUserId = this._extractAuthenticatedUserId(req);

      if (!authenticatedUserId) {
        return this._sendErrorResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          INVITE_GROUP_MESSAGES.UNAUTHORIZED
        );
      }

      const { inviteId } = this._mapParamsToInviteGroupParams(req.params);

      if (!inviteId) {
        return this._sendErrorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          INVITE_GROUP_MESSAGES.INVALID_INVITE_ID
        );
      }

      const result = await this.inviteGroupService.leaveInviteGroup(
        inviteId,
        authenticatedUserId
      );

      const statusCode = result.success
        ? StatusCodes.OK
        : StatusCodes.BAD_REQUEST;

      return this._sendResponse(res, statusCode, {
        success: result.success,
        message: result.message,
        data: {
          updatedInviteGroup: result.inviteGroup, // ✅ Updated invite group
          removedParticipant: {
            // ✅ Data of the participant who left
            ticketId: result.participantData?.ticketId?.toString(),
            amount: result.participantData?.amount,
            paymentStatus: result.participantData?.paymentStatus,
            seatAssigned: result.participantData?.seatAssigned,
            hasTicket: !!result.participantData?.ticketId,
            hasPaidAmount: !!result.participantData?.amount,
            needsRefund:
              result.participantData?.paymentStatus === "completed" &&
              !!result.participantData?.amount,
          },
        },
      });
    } catch (error: any) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || INVITE_GROUP_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async cancelInviteGroup(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const authenticatedUserId = this._extractAuthenticatedUserId(req);

      if (!authenticatedUserId) {
        return this._sendErrorResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          INVITE_GROUP_MESSAGES.UNAUTHORIZED
        );
      }

      const { inviteId } = this._mapParamsToInviteGroupParams(req.params);

      if (!inviteId) {
        return this._sendErrorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          INVITE_GROUP_MESSAGES.INVALID_INVITE_ID
        );
      }

      const result = await this.inviteGroupService.cancelInviteGroup(
        inviteId,
        authenticatedUserId
      );

      const statusCode = result.success
        ? StatusCodes.OK
        : StatusCodes.BAD_REQUEST;
  

      return this._sendResponse(res, statusCode, {
        success: result.success,
        message: result.message,
        data: result.participantDetails
          ? {
              participantDetails: result.participantDetails,
            }
          : undefined,
      });
    } catch (error: any) {
      return this._sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || INVITE_GROUP_MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }

  private _extractAuthenticatedUserId(
    req: AuthenticatedRequest
  ): string | null {
    return req.user?.id || null;
  }

  private _mapParamsToInviteGroupParams(params: any): InviteGroupParams {
    return {
      inviteId: params.inviteId,
    };
  }

  private _mapQueryToFilters(query: InviteGroupQuery): InviteGroupFilterDTO {
    return {
      limit: query.limit ? parseInt(query.limit) : 20,
      skip: query.skip ? parseInt(query.skip) : 0,
      minRating: query.minRating ? parseInt(query.minRating) : undefined,
      showtimeId: query.showtimeId,
      status: query.status ? (query.status.split(",") as any) : undefined,
    };
  }

  private _validateCreateInviteRequest(body: any): boolean {
    return !!(
      body.showtimeId &&
      body.movieId &&
      body.theaterId &&
      body.screenId &&
      body.requestedSeats &&
      Array.isArray(body.requestedSeats) &&
      body.requestedSeats.length > 0 &&
      body.totalSlotsRequested &&
      body.totalSlotsRequested >= 2
    );
  }

  private _validatePaymentDetails(details: any): boolean {
    return !!(details.inviteId && details.amount && details.amount > 0);
  }

  private _sendSuccessResponse(
    res: Response,
    statusCode: number,
    data: any
  ): Response {
    return res.status(statusCode).json({
      success: true,
      ...data,
    });
  }

  private _sendErrorResponse(
    res: Response,
    statusCode: number,
    message: string
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  private _sendResponse(
    res: Response,
    statusCode: number,
    data: any
  ): Response {
    return res.status(statusCode).json(data);
  }
}
