const fs = require('fs');
const url = require('url');
const http = require('http');
const replaceTemplate = require('./modules/replaceTamplate');
const slugify = require('slugify');


///////////////SERVER



const data = fs.readFileSync(`${(__dirname)}/dev-data/data.json`);
let dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lower: true}));

const overview = fs.readFileSync(`${(__dirname)}/templates/overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${(__dirname)}/templates/template_card.html`, 'utf-8');
const product = fs.readFileSync(`${(__dirname)}/templates/template_product.html`, 'utf-8');



const server = http.createServer( (req, res) => {
  
    const { query, pathname } = url.parse(req.url, true);

    //// OVERVIEW
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = overview.replace('{%PRODUCT_CARD%}', cardsHtml)
        res.end(output);

    ////PRODUCT
    } else if (pathname === '/product' ) {

        res.writeHead(200, {'Content-Type' : 'text/html'});
        const output = replaceTemplate(product, dataObj[query.id] );
        res.end(output);


        ///API
    } else if (pathname === '/api') {
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(data);
    }

    /////ERROR
    else {
        res.writeHead(404, {
            'Content-Type' : 'text/html'
        });
        res.end('<h1>Error 404</h1>')
    }
    
} );

server.listen(3000, () => {
    console.log('server working!');
})


