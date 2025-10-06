import express from 'express'
import { OwnerRequestController } from '../controllers/ownerRequest.controller';
import multer from 'multer';



export class OwnerRoute {
  constructor(
    private _router: express.Router = express.Router(),
    private _ownerRequestController:OwnerRequestController,
  private _upload = multer({ dest: 'uploads/' })
  ) {
    this._setRoutes();
  }
  private _setRoutes() {
    this._router.post('/send-otp',(req,res)=>this._ownerRequestController.sendOTP(req,res))
    this._router.post('/verify-otp',(req,res)=>this._ownerRequestController.verifyOTP(req,res))
    this._router.post('/submit-kyc',(req,res)=>this._ownerRequestController.submitKYC(req,res))
    this._router.get('/request-status/:requestId',(req,res)=>this._ownerRequestController.getRequestStatus(req,res))
    this._router.post('/upload',this._upload.single('file'),(req,res)=>this._ownerRequestController.uploadFile(req,res))

  }
    public getRouter() {
    return this._router;
  }

}
