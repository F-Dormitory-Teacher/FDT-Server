import Article from "../entity/Article";

export default interface ArticleList extends Article {
  userName?: string;
}
