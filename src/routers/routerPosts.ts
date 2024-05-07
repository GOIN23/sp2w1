import express, { Request, Response } from "express";
import { SETTINGS } from "../seting/seting";
import { validationResult } from "express-validator";
import { validaContentPosts, validaShortDescriptionPosts, validaTitlePosts, validablogIdPosts, validablogIdPostsCustm } from "../validation/validationsPostst";
import { errorValid } from "../utilt/errors";
import { authMiddleware } from "../auth/authMiddleware";
import { postsService } from "../services/posts-service";
import { qreposttoryPosts } from "../repository/qreposttoryPosts";
import { validaQurePageSezi, validaQureSortBy, validaQureipageNumber, validaQursortDirection } from "../validation/generalvValidation";
import { qureT } from "../types/generalType";

export const routerPosts = () => {
  const router = express.Router();

  router.get(
    "/",
    validaQursortDirection,
    validaQurePageSezi,
    validaQureipageNumber,
    validaQureSortBy,
    async (req: Request<{}, {}, {}, qureT>, res: Response) => {
      let result = await qreposttoryPosts.getPosts(req.query);
      res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send(result);
      return;
    }
  );

  router.post(
    "/",
    authMiddleware,
    validaTitlePosts,
    validaShortDescriptionPosts,
    validaContentPosts,
    validablogIdPosts,
    validablogIdPostsCustm,
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(SETTINGS.HTTPCOD.HTTPCOD_400).json(errorValid(errors.array({ onlyFirstError: true })));
        return;
      }
      const newPosts = await postsService.creatPosts(req.body);

      res.status(SETTINGS.HTTPCOD.HTTPCOD_201).send(newPosts);
      return;
    }
  );

  router.get("/:id", async (req: Request, res: Response) => {
    let result = await postsService.findPosts(req.params.id);

    if (!result) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
      return;
    }

    res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send(result);
    return;
  });

  router.put(
    "/:id",
    authMiddleware,
    validaTitlePosts,
    validaShortDescriptionPosts,
    validaContentPosts,
    validablogIdPosts,
    validablogIdPostsCustm,
    async (req: Request, res: Response) => {
      let resilt = await postsService.findPosts(req.params.id);

      if (!resilt) {
        res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errorValid(errors.array({ onlyFirstError: true })));
        return;
      }

      await postsService.updatPosts(req.body, req.params.id);
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
    }
  );

  router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
    let result = await postsService.findPosts(req.params.id);
    if (!result) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
      return;
    }
    postsService.deletePosts(req.params.id);
    res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
    return;
  });

  return router;
};
