import {createInterface} from 'node:readline/promises';
import {stdin,stdout} from 'node:process';
import {createStore,passwordHash} from '../server/store.js';
const rl=createInterface({input:stdin,output:stdout});
const username=(await rl.question('Usuário administrativo (3–40 letras/números): ')).trim();
if(!/^[a-zA-Z0-9_.-]{3,40}$/.test(username)){rl.close();throw Error('Usuário inválido.');}
rl.close();
function secret(prompt){return new Promise((resolve,reject)=>{if(!stdin.isTTY){reject(Error('Use um terminal interativo para criar a senha.'));return;}stdout.write(prompt);stdin.setRawMode(true);stdin.resume();let value='';const listener=chunk=>{for(const ch of chunk.toString()){if(ch==='\r'||ch==='\n'){stdin.off('data',listener);stdin.setRawMode(false);stdin.pause();stdout.write('\n');resolve(value);return;}if(ch==='\u0003'){stdin.setRawMode(false);process.exit(130);}if(ch==='\u007f')value=value.slice(0,-1);else if(ch>=' ')value+=ch;}};stdin.on('data',listener);});}
const password=await secret('Senha (mínimo 14 caracteres, não será exibida): ');
const confirm=await secret('Confirme a senha: ');if(password!==confirm||password.length<14||password.length>200)throw Error('Senhas diferentes ou tamanho inválido.');
const roleArg=process.argv.find(a=>a.startsWith('--role='))?.slice(7)||'admin';if(!['admin','advisor','editor','viewer'].includes(roleArg))throw Error('Função inválida.');
const store=createStore(process.env.DATA_DIR||'.data');try{store.db.prepare('INSERT INTO users(username,password,role) VALUES(?,?,?)').run(username,passwordHash(password),roleArg);store.audit('setup','user.create',username);console.log('Usuário criado. Acesse /admin. Nenhuma credencial foi incluída no HTML.');}finally{store.close();}
