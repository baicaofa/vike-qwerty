import type { NextFunction, Request, Response } from "express";

const MIN_APP_DATA_VERSION = "v10";

export function appVersionEnforce(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const headerValue = (req.headers["x-app-data-version"] || "").toString();

    if (
      !headerValue ||
      headerValue.trim().toLowerCase() !== MIN_APP_DATA_VERSION
    ) {
      res
        .status(426)
        .json({ code: "VERSION_REJECTED", min: MIN_APP_DATA_VERSION });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
}

export const MIN_SUPPORTED_APP_DATA_VERSION = MIN_APP_DATA_VERSION;
