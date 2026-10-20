import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dbPath=process.env.DATABASE_PATH ? path.resolve(root,process.env.DATABASE_PATH) : path.join(root,'data/aurel.sqlite');
fs.mkdirSync(path.dirname(dbPath),{recursive:true});
export const db=new Database(dbPath);
db.pragma('journal_mode = WAL'); db.pragma('foreign_keys = ON');
db.exec(`CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS appointments (id INTEGER PRIMARY KEY AUTOINCREMENT,reference TEXT NOT NULL UNIQUE,full_name TEXT NOT NULL,email TEXT NOT NULL,phone TEXT,contact_method TEXT NOT NULL,preferred_date TEXT,patient_type TEXT NOT NULL,category TEXT NOT NULL,consent_at TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'New' CHECK(status IN ('New','Contacted','Confirmed','Completed','Cancelled')),created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created ON appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(email);
CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT,admin_id INTEGER,appointment_id INTEGER,action TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(admin_id) REFERENCES admins(id),FOREIGN KEY(appointment_id) REFERENCES appointments(id));`);
export function publicAppointment(row){if(!row)return row;const {consent_at,...safe}=row;return safe;}
