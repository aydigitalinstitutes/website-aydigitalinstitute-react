import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

export const configurePassport = (): void => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:5001';

  if (googleClientId && googleClientSecret) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: googleClientId,
          clientSecret: googleClientSecret,
          callbackURL: `${apiBaseUrl}/api/auth/google/callback`,
        },
        async (_accessToken: any, _refreshToken: any, profile: any, done: any) => {
          done(null, profile);
        }
      )
    );
  }

  if (githubClientId && githubClientSecret) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: githubClientId,
          clientSecret: githubClientSecret,
          callbackURL: `${apiBaseUrl}/api/auth/github/callback`,
          scope: ['user:email'],
        },
        async (_accessToken: any, _refreshToken: any, profile: any, done: any) => {
          done(null, profile);
        }
      )
    );
  }
};

