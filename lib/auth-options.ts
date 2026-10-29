import { betterAuth, type BetterAuthOptions } from 'better-auth';
export function createVoltaraAuth(options: {database:BetterAuthOptions['database'];secret:string;baseURL:string;sendEmail:(to:string,subject:string,url:string)=>Promise<void>}) {
  return betterAuth({
    database: options.database,
    secret: options.secret,
    baseURL: options.baseURL,
    trustedOrigins: [options.baseURL],
    advanced: {ipAddress: {ipAddressHeaders: ['cf-connecting-ip']}},
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      minPasswordLength: 12,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({user, url}) => options.sendEmail(user.email, 'بازیابی گذرواژه ولتارا', url),
    },
    emailVerification: {
      sendOnSignUp: false,
      sendVerificationEmail: async ({user, url}) => options.sendEmail(user.email, 'تأیید حساب ولتارا', url),
    },
    rateLimit: { enabled: true, storage: 'database' },
  });
}
