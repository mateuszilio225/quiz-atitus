import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
let html=readFileSync('index.html','utf8');
html=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>\n'+readFileSync('style.css','utf8')+'\n</style>');
for(const file of ['shared/catalog.js','shared/domain.js','shared/knowledge.js','script.js'])html=html.replace(`<script src="${file}"></script>`,()=>'<script>\n'+readFileSync(file,'utf8').replace(/<\/script/gi,'<\\/script')+'\n</script>');
mkdirSync('artifacts',{recursive:true});writeFileSync('artifacts/atitus-experience-2.html',html);console.log('HTML público independente gerado em artifacts/atitus-experience-2.html. API e painel exigem npm start.');
