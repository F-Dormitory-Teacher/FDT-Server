import LostProduct from "../entity/LostProduct";

export default interface LostProductList extends LostProduct {
  userName?: string;
  userStudentId?: string;
}
