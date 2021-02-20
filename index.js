const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate')   ;
// const { readFile } = require('fs/promises');
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is all i know ${textIn}\n Created On ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);

// fs.readFile('./txt/starttt.txt', 'utf-8',(err, data1) => {

//     if(err) return console.log(`Error! file not found!!!`);
//     console.log(data1);
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//       console.log(data2);
//       fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//           fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8', (err) => {
//                console.log("File read successfully");
//           });
//       });
//   });
// });

// console.log("read file");

//SERVER

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8'); // these are top level code so no problem in writing at top.
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  //has request to two object request and response this will be called on being called.

  // overview

  const { query, pathname } = url.parse(req.url, true); // here query will be an obejct containg the varible and pathname constains pathname
  // url.parse(req.url,true) return an object with different fields
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObj
      .map((el) => {
        return replaceTemplate(tempCard, el);
      })
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
    // product page
  } else if (pathname === '/product') {
    // product
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //api
  } else if (pathname === '/api') {
    //api
    res.writeHead(200, {
      'Content-type': 'application/json',
    }); // api
    res.end(data); // response should be a string not a object or anything else

    //not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page Not Found!</h1>'); // note that these headers and status code always being set before we send response
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
