import {createApp} from './app.js';
const runtime=createApp();const port=Number(process.env.PORT)||3000,host=process.env.HOST||'127.0.0.1';
const server=runtime.app.listen(port,host,()=>console.log(`Atitus Experience 2.0 · demonstração em ${host}:${port}. Painel em /admin. Somente identidades fictícias.`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>{runtime.close();process.exit(0);}));
