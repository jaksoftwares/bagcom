const fs = require('fs');
const file = 'c:/Users/josep/bagcom/lib/mail.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const POSTMARK_FROM_EMAIL = process.env.POSTMARK_FROM_EMAIL || 'contact@dovepeakdigital.com';",
  "const POSTMARK_FROM_EMAIL = process.env.POSTMARK_FROM_EMAIL || 'contact@dovepeakdigital.com';\nconst APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://bagcom.dovepeakdigital.com';"
);

content = content.replace('https://bagcom.dovepeakdigital.com/auth/login', '${APP_URL}/login');
content = content.replace(/https:\/\/bagcom\.dovepeakdigital\.com/g, '${APP_URL}');

fs.writeFileSync(file, content);
console.log('Fixed mail.ts');
