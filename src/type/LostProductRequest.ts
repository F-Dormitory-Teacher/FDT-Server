import LostProduct from "../entity/LostProduct";
import AuthRequest from "./AuthRequest";

export default interface LostProductRequest extends AuthRequest {
  lostProduct: LostProduct;
}
