import express, { Request, Response } from "express";
import { usersService } from "../services/users-service";
import { SETTINGS } from "../seting/seting";
import { validaPassword, validaloginOrEmail } from "../validation/validationUsers";

export const routerAuth = () => {
  const router = express.Router();

  router.post("/", validaloginOrEmail, validaPassword, async (req: Request, res: Response) => {
    const user = await usersService.checkCreadentlais(req.body.loginOrEmail, req.body.password);

    if (!user) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_401);
      return;
    }

    res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
  });

  return router;
};
