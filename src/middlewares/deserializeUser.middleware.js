import { getSession } from "../../services/session.service.js";

export const deserializeUser = async (req, res, next) => {
  const token = req.headers["session-token"];
  if (!token) return next();

  const session = await getSession(token, true);

  if (session) {
    res.locals.user = session?.user;
    res.locals.session = session;
  }

  next();
};

export const requireUser = (req, res, next) => {
  if (!res.locals.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
