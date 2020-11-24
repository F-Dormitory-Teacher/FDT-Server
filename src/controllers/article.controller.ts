import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Article from "../entity/Article";
import User from "../entity/User";
import ArticleStatus from "../enum/ArticleStatus";
import logger from "../lib/logger";
import { validateChange, validateCreate, validateModify } from "../lib/validation/article";
import article from "../routes/article";
import ArticleList from "../type/ArticleList";
import AuthRequest from "../type/AuthRequest";

const getArticles = async (req: Request, res: Response) => {
  try {
    const articleRepo = getRepository(Article);
    const articles: ArticleList[] = await articleRepo.find();

    const userRepo = getRepository(User);

    for (let i in articles) {
      const user: User = await userRepo.findOne({ idx: articles[i].userIdx });

      if (!user) {
        articles[i].userName = null;
      } else {
        articles[i].userName = user.name;
      }
    }

    logger.green("[GET] 물품 신청 목록 조회 성공.");
    return res.status(200).json({
      status: 200,
      message: "물품 신청 목록 조회 성공.",
      data: {
        articles
      }
    });
  } catch (err) {
    logger.red("[GET] 물품 신청 목록 조회 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

const getArticle = async (req: Request, res: Response) => {
  const idx: number = Number(req.params.idx);

  if (isNaN(idx)) {
    logger.yellow("[GET] 검증 오류.", "idx is NaN");
    res.status(400).json({
      status: 400,
      message: "검증 오류."
    });
    return;
  }

  try {
    const articleRepo = getRepository(Article);
    const article: ArticleList = await articleRepo.findOne({ idx });

    if (!article) {
      logger.yellow("[GET] 물품 신청 없음.");
      return res.status(404).json({
        status: 404,
        message: "물품 신청 없음."
      });
    }

    const userRepo = getRepository(User);
    const user: User = await userRepo.findOne({ idx: article.userIdx });
    if (!user) {
      article.userName = null;
    } else {
      article.userName = user.name;
    }

    logger.green("[GET] 물품 신청 목록 조회 성공.");
    return res.status(200).json({
      status: 200,
      message: "물품 신청 목록 조회 성공.",
      data: {
        article
      }
    });
  } catch (err) {
    logger.red("[GET] 물품 신청 목록 조회 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

const getMyArticles = async (req: AuthRequest, res: Response) => {
  const user: User = req.user;

  try {
    const articleRepo = getRepository(Article);
    const articles: ArticleList[] = await articleRepo.find({ user });

    for (let i in articles) {
      articles[i].userName = user.name;
    }

    logger.green("[GET] 내 물품 신청 목록 조회 성공.");
    return res.status(200).json({
      status: 200,
      message: "내 물품 신청 목록 조회 성공.",
      data: {
        articles
      }
    });
  } catch (err) {
    logger.red("[GET] 내 물품 신청 목록 조회 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

const createArticle = async (req: AuthRequest, res: Response) => {
  if (!validateCreate(req, res)) return;

  const user: User = req.user;

  type RequestBody = {
    body: {
      title: string;
      content: string;
      image?: string;
    };
  };

  const { body }: RequestBody = req;
  try {
    const articleRepo = getRepository(Article);
    const article: Article = new Article();

    article.title = body.title;
    article.content = body.content;
    article.image = body.image;
    article.user = user;

    await articleRepo.save(article);

    logger.green("[POST] 물품 신청 성공.");
    return res.status(200).json({
      status: 200,
      message: "물품 신청 성공."
    });
  } catch (err) {
    logger.red("[POST] 물품 신청 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

const modifyArticle = async (req: AuthRequest, res: Response) => {
  if (!validateModify(req, res)) return;

  const idx: number = Number(req.params.idx);

  if (isNaN(idx)) {
    logger.yellow("[DELETE] 검증 오류.", "idx is NaN");
    res.status(400).json({
      status: 400,
      message: "검증 오류."
    });
    return;
  }

  const user: User = req.user;

  type RequestBody = {
    body: {
      title?: string;
      content?: string;
      image?: string;
    };
  };

  const { body }: RequestBody = req;
  try {
    const articleRepo = getRepository(Article);
    const article: Article = await articleRepo.findOne({ idx });

    if (!article) {
      logger.yellow("[PUT] 물품 신청 없음.");
      return res.status(404).json({
        status: 404,
        message: "물품 신청 없음."
      });
    }

    if (article.userIdx !== user.idx || article.status === ArticleStatus.COMPLETED) {
      logger.yellow("[PUT] 물품 신청 권한 없음.");
      return res.status(403).json({
        status: 403,
        message: "자신의 글이 아니거나 이미 처리 완료된 글입니다."
      });
    }

    article.title = body.title || article.title;
    article.content = body.content || article.content;
    article.image = body.image !== undefined ? body.image : article.image;
    article.user = user;

    await articleRepo.save(article);

    logger.green("[PUT] 물품 신청 수정 성공.");
    return res.status(200).json({
      status: 200,
      message: "물품 신청 수정 성공."
    });
  } catch (err) {
    logger.red("[PUT] 물품 신청 수정 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

const changeArticle = async (req: AuthRequest, res: Response) => {
  if (!validateChange(req, res)) return;

  const idx: number = Number(req.params.idx);

  if (isNaN(idx)) {
    logger.yellow("[DELETE] 검증 오류.", "idx is NaN");
    res.status(400).json({
      status: 400,
      message: "검증 오류."
    });
    return;
  }

  type RequestBody = {
    body: {
      status: ArticleStatus;
    };
  };

  const { body }: RequestBody = req;
  try {
    const articleRepo = getRepository(Article);
    const article: Article = await articleRepo.findOne({ idx });

    if (!article) {
      logger.yellow("[PUT] 물품 신청 없음.");
      return res.status(404).json({
        status: 404,
        message: "물품 신청 없음."
      });
    }

    article.status = body.status;

    await articleRepo.save(article);

    logger.green("[PUT] 물품 신청 상태 수정 성공.");
    return res.status(200).json({
      status: 200,
      message: "물품 신청 상태 수정 성공."
    });
  } catch (err) {
    logger.red("[PUT] 물품 신청 상태 수정 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

const deleteArticle = async (req: AuthRequest, res: Response) => {
  const idx: number = Number(req.params.idx);

  if (isNaN(idx)) {
    logger.yellow("[DELETE] 검증 오류.", "idx is NaN");
    res.status(400).json({
      status: 400,
      message: "검증 오류."
    });
    return;
  }

  const user: User = req.user;

  try {
    const articleRepo = getRepository(Article);
    const article: Article = await articleRepo.findOne({ idx });

    if (!article) {
      logger.yellow("[DELETE] 물품 신청 없음.");
      return res.status(404).json({
        status: 404,
        message: "물품 신청 없음."
      });
    }

    if (!user.isAdmin && article.userIdx !== user.idx) {
      logger.yellow("[DELETE] 물품 신청 삭제 권한 없음.");
      return res.status(403).json({
        status: 403,
        message: "권한 없음."
      });
    }

    await articleRepo.remove(article);

    logger.green("[DELETE] 물품 신청 삭제 성공.");
    return res.status(200).json({
      status: 200,
      message: "물품 신청 삭제 성공."
    });
  } catch (err) {
    logger.red("[DELETE] 물품 신청 삭제 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

export default {
  getArticle,
  getArticles,
  getMyArticles,
  createArticle,
  modifyArticle,
  changeArticle,
  deleteArticle
};
