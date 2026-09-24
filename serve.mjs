import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}const p=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(p!==root&&!p.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(p,(err,b)=>{if(err){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'})[path.extname(p)]||'application/octet-stream','Cache-Control':'no-store'});res.end(b);});}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
