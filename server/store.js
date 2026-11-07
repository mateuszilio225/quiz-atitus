import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {randomBytes,createCipheriv,createDecipheriv,createHmac,scryptSync,timingSafeEqual} from 'node:crypto';
import '../shared/catalog.js';
export function createStore(directory) {
 const dir=resolve(directory);mkdirSync(dir,{recursive:true,mode:0o700});
 const keyPath=join(dir,'encryption.key');if(!existsSync(keyPath))writeFileSync(keyPath,randomBytes(32),{mode:0o600,flag:'wx'});const key=readFileSync(keyPath);if(key.length!==32)throw Error('Chave local inválida.');
 const db=new DatabaseSync(join(dir,'experience.sqlite'));db.exec(`PRAGMA journal_mode=WAL; PRAGMA secure_delete=ON; PRAGMA foreign_keys=ON;
 CREATE TABLE IF NOT EXISTS courses(id TEXT PRIMARY KEY,data TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS settings(id INTEGER PRIMARY KEY CHECK(id=1),data TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,username TEXT UNIQUE NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id INTEGER,csrf TEXT NOT NULL,expires INTEGER NOT NULL,FOREIGN KEY(user_id) REFERENCES users(id));
 CREATE TABLE IF NOT EXISTS form_tokens(token TEXT PRIMARY KEY,session TEXT NOT NULL,created INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS leads(id TEXT PRIMARY KEY,identity TEXT NOT NULL,dedupe TEXT UNIQUE NOT NULL,course_id TEXT NOT NULL,source TEXT NOT NULL,status TEXT NOT NULL,created TEXT NOT NULL,updated TEXT NOT NULL,seeded INTEGER NOT NULL DEFAULT 0);
 CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY,session TEXT NOT NULL,event TEXT NOT NULL,course_id TEXT,step INTEGER,utm TEXT NOT NULL,created TEXT NOT NULL,seeded INTEGER NOT NULL DEFAULT 0);
 CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,actor TEXT NOT NULL,action TEXT NOT NULL,target TEXT NOT NULL,created TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS limits(bucket TEXT PRIMARY KEY,hits INTEGER NOT NULL,expires INTEGER NOT NULL);`);
 const seed=db.prepare('INSERT OR IGNORE INTO courses VALUES(?,?)');for(const c of AtitusCatalog.courses)seed.run(c.id,JSON.stringify(c));
 db.prepare('INSERT OR IGNORE INTO settings VALUES(1,?)').run(JSON.stringify({retentionDays:Math.max(1,Math.min(365,Number(process.env.RETENTION_DAYS)||30)),whatsappNumber:process.env.WHATSAPP_CONFIRMED==='true'&&/^\d{10,15}$/.test(process.env.WHATSAPP_NUMBER||'')?process.env.WHATSAPP_NUMBER:'',whatsappConfirmed:process.env.WHATSAPP_CONFIRMED==='true'&&/^\d{10,15}$/.test(process.env.WHATSAPP_NUMBER||''),rules:[]}));
 const encrypt=data=>{const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);const body=Buffer.concat([cipher.update(JSON.stringify(data),'utf8'),cipher.final()]);return [iv.toString('base64'),cipher.getAuthTag().toString('base64'),body.toString('base64')].join('.');};
 const decrypt=text=>{const [iv,tag,body]=text.split('.').map(x=>Buffer.from(x,'base64'));const cipher=createDecipheriv('aes-256-gcm',key,iv);cipher.setAuthTag(tag);return JSON.parse(Buffer.concat([cipher.update(body),cipher.final()]).toString('utf8'));};
 const hash=text=>createHmac('sha256',key).update(text).digest('hex');
 const courses=()=>db.prepare('SELECT data FROM courses ORDER BY id').all().map(r=>JSON.parse(r.data));
 const settings=()=>JSON.parse(db.prepare('SELECT data FROM settings WHERE id=1').get().data);
 const audit=(actor,action,target)=>db.prepare('INSERT INTO audit(actor,action,target,created) VALUES(?,?,?,?)').run(String(actor),action,String(target),new Date().toISOString());
 const purge=()=>{const before=new Date(Date.now()-settings().retentionDays*86400000).toISOString();const result=db.prepare('DELETE FROM leads WHERE created < ?').run(before);db.prepare('DELETE FROM events WHERE created < ?').run(before);db.prepare('DELETE FROM audit WHERE created < ?').run(before);db.prepare('DELETE FROM sessions WHERE expires < ?').run(Date.now());db.prepare('DELETE FROM limits WHERE expires < ?').run(Date.now());db.prepare('DELETE FROM form_tokens WHERE created < ?').run(Date.now()-7200000);return Number(result.changes);};
 return {db,encrypt,decrypt,hash,courses,settings,audit,purge,close:()=>db.close()};
}
export function passwordHash(password){const salt=randomBytes(16).toString('hex');return salt+':'+scryptSync(password,salt,64).toString('hex');}
export function passwordValid(password,stored){try{const [salt,value]=stored.split(':');const actual=scryptSync(password,salt,64),expected=Buffer.from(value,'hex');return actual.length===expected.length&&timingSafeEqual(actual,expected);}catch{return false;}}
