import { Request, Response, NextFunction } from "express";
import { createResponse } from "../../../utils/createResponse";
import { IUserService } from "../interfaces/user.interface";
import { IAuthService } from "../../auth/interfaces/auth.interface";
import { IMovieService } from "../../movies/interfaces/movies.interface";

export class UserController {
  constructor(
    private readonly userService: IUserService,
    private readonly authService: IAuthService,
    private readonly movieService: IMovieService
  ) {}

  async signup(req: Request, res: Response) {
    try {
      const userData = req.body;
      if (!userData.username || !userData.email || !userData.password) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Username, email and password are required",
          })
        );
      }
      const result = await this.userService.signup(userData);
      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(201).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
       res.status(500).json(
          createResponse({
            success: false,
            message: err.message,
          })
        )
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const email = String(req.body?.email || "")
        .trim()
        .toLowerCase();
      const otp = String(req.body?.otp || "").trim();

      if (!email || !otp) {
        return res
          .status(400)
          .json(
            createResponse({
              success: false,
              message: "Email and OTP are required",
            })
          );
      }

      const result = await this.userService.verifyOTP(email, otp);
      if (!result.success) {
        return res
          .status(400)
          .json(createResponse({ success: false, message: result.message }));
      }

      const user = result.data?.user;
      if (!user) {
        return res
          .status(500)
          .json(
            createResponse({
              success: false,
              message: "Verification succeeded but user is missing",
            })
          );
      }

      try {
        const { accessToken, refreshToken } =
          this.authService.generateTokenPair(user, "user");
        await this.authService.storeRefreshToken(
          String(user._id),
          refreshToken,
          "user"
        );

        this.setAuthCookies(res, accessToken, refreshToken);

        return res.status(200).json(
          createResponse({
            success: true,
            message: "Email verified and logged in successfully",
            data: {
              user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isVerified: true,
                xpPoints: user.xpPoints,
                role: "user",
              },
              role: "user",
              redirectTo: "/dashboard",
              isNewUser: true,
            },
          })
        );
      } catch (tokenError) {
        console.error("Token generation error:", tokenError);
        return res.status(200).json(
          createResponse({
            success: true,
            message: "Email verified successfully. Please login manually.",
            data: result.data, // includes xpBonus etc.
          })
        );
      }
    } catch (err) {
      res.status(500).json(
          createResponse({
            success: false,
            message: err.message,
          })
        )
    }
  }

  async resendOTP(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Email is required",
          })
        );
      }

      const result = await this.userService.resendOTP(email);

      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
        })
      );
    } catch (err) {
     res.status(500).json(
          createResponse({
            success: false,
            message: err.message,
          })
        )
    }
  }

  async getUserProfile(req: Request, res: Response) {
    try {
      const { id } = req.user;

      if (!id) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "User ID is required",
          })
        );
      }

      const result = await this.userService.getUserProfile(id);

      if (!result.success) {
        return res.status(404).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(500).json(
          createResponse({
            success: false,
            message: err.message,
          })
        )
    }
  }

  refreshToken = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json(
          createResponse({
            success: false,
            message: "Refresh token required.",
          })
        );
      }

      const refreshResult = await this.authService.refreshAccessToken(
        refreshToken
      );

      if (!refreshResult.success) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(401).json(
          createResponse({
            success: false,
            message: "Invalid refresh token. Please login again.",
          })
        );
      }
      console.log("acces token suiiiiii", refreshResult.data.accessToken);

      res.cookie("accessToken", refreshResult.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshResult.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json(
        createResponse({
          success: true,
          message: "Token refreshed successfully",
        })
      );
    } catch (error) {
      console.error("Token refresh error:", error);
      return res.status(401).json(
        createResponse({
          success: false,
          message: "Token refresh failed.",
        })
      );
    }
  };

  async updateProfile(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "User ID is required",
          })
        );
      }

      const result = await this.userService.updateProfile(id, updateData);

      if (!result.success) {
        return res.status(404).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(500).json(
          createResponse({
            success: false,
            message: err.message,
          })
        )
    }
  }
  async updateUserLocation(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const { latitude, longitude } = req.body;

      if (!id) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "User ID is required",
          })
        );
      }

      if (latitude === undefined || longitude === undefined) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Latitude and longitude are required",
          })
        );
      }

      if (
        longitude < -180 ||
        longitude > 180 ||
        latitude < -90 ||
        latitude > 90
      ) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Invalid coordinates range",
          })
        );
      }

      const locationData: {
        location: { type: "Point"; coordinates: [number, number] };
      } = {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      };

      const result = await this.userService.updateProfile(id, locationData);

      if (!result.success) {
        return res.status(404).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
     res.status(500).json(
          createResponse({
            success: false,
            message: err.message,
          })
        )
    }
  }

  async getNearbyUsers(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { maxDistance } = req.query;

      if (!id) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "User ID is required",
          })
        );
      }

      const result = await this.userService.getNearbyUsers(
        id,
        maxDistance ? parseInt(maxDistance as string) : 5000
      );

      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(500).json(
          createResponse({
            success: false,
            message: err.message,
          })
        )
    }
  }

  async addXpPoints(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { points } = req.body;

      if (!id || !points) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "User ID and points are required",
          })
        );
      }

      const result = await this.userService.addXpPoints(id, points);

      if (!result.success) {
        return res.status(404).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
        })
      );
    } catch (err) {
      res.status(500).json(
          createResponse({
            success: false,
            message: err.message,
          })
        )
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { id } = req.user;
      if (!id) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "User id is required",
          })
        );
      }
      const { oldpassword, newPassword } = req.body;
      const oldPassword = oldpassword;

      if (!oldPassword || !newPassword) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Old password and new password required",
          })
        );
      }

      const result = await this.userService.changePassword(
        id,
        oldPassword,
        newPassword
      );
      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: "Password updated succusfully",
        })
      );
    } catch (error) {
       res.status(500).json(
          createResponse({
            success: false,
            message: error.message,
          })
        )
    }
  }

  async changeEmail(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const { newEmail, password } = req.body;

      if (!newEmail || !password) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "New email and password are required",
          })
        );
      }
      const result = await this.userService.sendEmailChangeOTP(
        id,
        newEmail,
        password
      );
      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
      return res.status(200).json(
        createResponse({
          success: true,
          message: "Email changed successfully",
        })
      );
    } catch (error) {
      res.status(500).json(
          createResponse({
            success: false,
            message: error.message,
          })
        )
    }
  }

  async verifyChangeEmailOtp(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const { email, otp } = req.body;
      if (!id) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "user Id is required",
          })
        );
      }

      if (!email || !otp) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Email and otp required",
          })
        );
      }

      const result = await this.userService.verifyEmailChangeOTP(
        id,
        email,
        otp
      );

      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: "Email changed succesfully",
        })
      );
    } catch (error) {
    res.status(500).json(
          createResponse({
            success: false,
            message: error.message,
          })
        )
    }
  }

  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  async getUserCounts(req: Request, res: Response) {
    try {
      const result = await this.userService.getUserCounts();

      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(500).json(
          createResponse({
            success: false,
            message: err.message,
          })
        )
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const filters = req.query;
      const result = await this.userService.getUsers(filters);

      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(500).json(
          createResponse({
            success: false,
            message: err.message,
          })
        )
    }
  }

  async toggleUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "User ID is required",
          })
        );
      }

      const result = await this.userService.toggleUserStatus(id);

      if (!result.success) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(500).json(
          createResponse({
            success: false,
            message: err.message,
          })
        )
    }
  }

  async getUserDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "User ID is required",
          })
        );
      }

      const result = await this.userService.getUserDetails(id);

      if (!result.success) {
        return res.status(404).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (err) {
      res.status(500).json(
          createResponse({
            success: false,
            message: err.message,
          })
        )
    }
  }
}
