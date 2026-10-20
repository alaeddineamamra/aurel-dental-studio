import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {db} from './db.js';
const email=process.env.ADMIN_EMAIL?.trim().toLowerCase(); const password=process.env.ADMIN_PASSWORD;
if(!email||!password||password.length<12||password==='replace-with-a-long-unique-password'){
 console.error('Set ADMIN_EMAIL and a unique ADMIN_PASSWORD (at least 12 characters) in .env before running npm run db:init.'); process.exit(1);
}
const existing=db.prepare('SELECT id FROM admins WHERE email=?').get(email);
if(existing){console.error('An administrator with that email already exists. No changes made.');process.exit(1);}
const hash=await bcrypt.hash(password,12); db.prepare('INSERT INTO admins(email,password_hash) VALUES(?,?)').run(email,hash);
console.log(`Administrator created for ${email}. Keep your credentials private.`); db.close();
