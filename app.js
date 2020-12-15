const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers':
    'x-test,Content-Type,Accept, Access-Control-Allow-Headers',
};

export default function appSrc(express, bodyParser, createReadStream, crypto, http,puppeteer) {
  const app = express();

  app
    .use((req, res, next) => {
      res.set(CORS);
      next();
    })
  
    .use(bodyParser.urlencoded({ extended: true }))
  
    .get('/sha1/:input', (req, res) => {
      let hash = crypto.createHash('sha1');
      hash.update(req.params.input);
      res.send(hash.digest('hex'));
    })

    .get('/login/', (req, res) => res.send('strax5'))
  
    .get('/test/', async (req, res) => {
      const url = req.query.URL;
      //console.log(url);
      //console.log("Начало загрузки браузера");
      const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox' ] //'--disable-setuid-sandbox']
        });
      //console.log("Браузер загрузился");
      const page = await browser.newPage();
      await page.goto(url);
      await page.waitForSelector('#bt');
      await page.click('#bt');
      await page.waitForSelector('#inp');
      const got = await page.$eval('#inp', el = el.value);
      console.log(got);
      browser.close();
      res
          .set({
            'Content-Type': 'text/plain; charset=utf-8',
          })
          .end(String(url));
      })

    .get('/code/', (req, res) => {
      let filename = import.meta.url.substring(7);
      createReadStream(filename).pipe(res);
    });

  app.all('/req/', (req, res) => {
    let url1 = req.query.addr;
    http.get(url1, (response) => {
      let data = '';
      response.on('data', (chunk) => (data += chunk));
      response.on('end', () => {
        res
          .set({
            'Content-Type': 'text/plain; charset=utf-8',
          })
          .end(data);
      });
    });
  });

  app.all('*', (req, res) => {
    res.send('strax5');
  });
  
  return app;
}
