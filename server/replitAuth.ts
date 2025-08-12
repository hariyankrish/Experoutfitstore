// server/replitAuth.ts
import type { Express } from "express";

const DEV_BYPASS = process.env.DISABLE_AUTH === "true";

/**
 * In dev (DISABLE_AUTH=true) this is a no-op.
 * In prod, we dynamically import passport + express-session + passport-openidconnect.
 */
export async function setupAuth(app: Express) {
  if (DEV_BYPASS) {
    console.log("[auth] Disabled (DEV_BYPASS)");
    return;
  }

  const { default: session } = await import("express-session");
  const passport = (await import("passport")).default;
  const { Strategy: OpenIDConnectStrategy } = await import("passport-openidconnect");

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new OpenIDConnectStrategy(
      {
        issuer: process.env.OIDC_ISSUER!,
        authorizationURL: `${process.env.OIDC_ISSUER}/auth`,
        tokenURL: `${process.env.OIDC_ISSUER}/token`,
        userInfoURL: `${process.env.OIDC_ISSUER}/me`,
        clientID: process.env.OIDC_CLIENT_ID!,
        clientSecret: process.env.OIDC_CLIENT_SECRET!,
        callbackURL: process.env.OIDC_CALLBACK_URL!,
        scope: "openid profile email",
      },
      (_issuer, profile, _context, _idToken, _access, _refresh, done) => {
        return done(null, profile);
      }
    )
  );

  passport.serializeUser((user: any, done) => done(null, user));
  passport.deserializeUser((obj: any, done) => done(null, obj));
}

/** Dev-safe guard */
export function isAuthenticated(req: any, res: any, next: any) {
  if (DEV_BYPASS) return next();
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  return next();
}