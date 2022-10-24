const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/recplaceTemplate');

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObject = JSON.parse(data);

const slugs = dataObject.map(el=>slugify(el.productName,{lower:true}));
console.log(slugs);
//-------Create Server------------
const server = http.createServer((req,res)=>{
    // send back response
    const {query,pathname} = url.parse(req.url,true);
    if(pathname === '/overview' || pathname === '/')
    {
        const cardsHtml = dataObject.map(element => replaceTemplate(tempCard,element)).join('');
        const output = tempOverview.replace(/%PRODUCT_CARDS%/g,cardsHtml);
        res.end(output);   
    }
    else if (pathname==='/product')
    {
        // res.writeHead(200,{'Content-type':'text/html'});
        const product = dataObject[query.id]
        const output = replaceTemplate(tempProduct,product);
        res.end(output);
    }
    // else if(pathname ==='/Api')
    // {
    //     res.writeHead(200,{
    //         'Content-type':'application/json'
    //     });
    //     res.end(data);    
    // }
    else
    {
        res.writeHead(404);
        res.end('page not found');
    }
})

//-----------Start Server------------
server.listen(8000,'127.0.0.1',()=>{
    console.log('listen to requests on port 8000');
})