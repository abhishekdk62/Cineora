import express from 'express'
import { OwnerRequestController } from '../controllers/ownerRequest.controller';



export class OwnerRoute {
  constructor(
    private router: express.Router = express.Router(),
    private ownerRequestController:OwnerRequestController
  
  ) {
    this.setRoutes();
  }
  private setRoutes() {
    this.router.post('/send-otp',(req,res)=>this.ownerRequestController.sendOTP(req,res))
    this.router.post('/verify-otp',(req,res)=>this.ownerRequestController.verifyOTP(req,res))
    this.router.post('/submit-kyc',(req,res)=>this.ownerRequestController.submitKYC(req,res))
    this.router.get('/request-status/:requestId',(req,res)=>this.ownerRequestController.getRequestStatus(req,res))

  }
    public getRouter() {
    return this.router;
  }

}
