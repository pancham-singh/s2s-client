import { resolve } from 'path';

export const isProduction = process.env.NODE_ENV === 'production';
export const isRelease = process.env.NODE_ENV === 'release';

export const jwtSecret =
  '5A682?bE1[07*|3:M9(7dB&T4[<12@]C[2f>4%D?(Q1F~Y7NX+B66L[Z[?]{A>CO|{]4M90+@2~|?@?32(DT+8<~(%O5QM>23??E74<][X<((M{*N61B0+[6{(914(<%';
export const sessionSecret =
  'c(f1b6e5|{T128|49Da>[C]*73L?31M6~<B[7N&F92>%>8{[XY[E42~{<1Z5F*:D(@|]3]{2<%4W>T<7*D&]3(L0>Q7]816+~*:*(%B6(L(2&A@OY1?D?EM8F*3|*{[[';

export const db = {
  host: process.env.DB_HOST || '0.0.0.0',
  name: process.env.DB_NAME || 'skill2skills',
  user: process.env.DB_USER || 'skill2skills',
  password: process.env.DB_PASSWORD || 'skill2skills@user'
};

export const redis = {
  host: process.env.REDIS_HOST || '0.0.0.0'
};

export const uploadDir = resolve(__dirname, '../uploads');

let baseHost = 'localhost:4000';

const mailConfig = {
  smtp: {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: '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'
    }
  }
};

if (isProduction) {
  baseHost = 'skill2skills.com';
}

if (isRelease) {
  baseHost = 'beta.skill2skills.com';
}

export const baseHostname = baseHost;
export const mail = mailConfig;
