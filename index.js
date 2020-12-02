const fs = require('fs');
const url = require('url');
const http = require('http');

//////////////FILES
//Blocking sync code
// const fileIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// //console.log(fileIn);
// const addText = `This all ${fileIn}\n\about avocado at ${Date.now()}`;
// fs.writeFileSync('./txt/new.txt', addText);

//Non-Blocking async code

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('Error!');
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             fs.writeFile('./txt/final.txt', `${data2} ${data3}`, 'utf-8', err => {
//                 console.log('File written!!');
//             } )
//         })
// })
// })
///////////////SERVER

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    //replace(RegExp/g, something) - regExp позволяет заменить не только первое вхождение
    //в отличие от строки '{%PRODUCTNAME%}'
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    if (!product.organic) {
        output.replace(/{%NOT_ORGANIC%}/g, 'not_organic');
    }

    return output
   
};

const data = fs.readFileSync(`${(__dirname)}/dev-data/data.json`);
let dataObj = JSON.parse(data);

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


