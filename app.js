const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers':
    'x-test,Content-Type,Accept, Access-Control-Allow-Headers',
};

export default function appSrc(express, bodyParser, createReadStream, crypto, http, Browser, assert) {

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
      var got = 0;
      console.log(url);
      console.log("Создали браузер");
      const browser = new Browser({silent: true});
      await browser
        .visit(url)
        .then( function() {
          assert.ok(browser.success);
          console.log("Контрольная точка кнопка");
          return browser.pressButton('#bt')})
        .then( async function() {
          assert.ok(browser.success);
          got = await browser.text('#inp').value;
          console.log("Контрольная точка");}); 
      /*
      console.log("Браузер загрузился");
      await browser.visit(url);
      assert.ok(browser.success);
      console.log("Пошли на страницу");
      await browser.pressButton('#bt');
      console.log("Нажали кнопку");
      assert.ok(browser.success);
      const got = await browser.text('#inp');
      console.log("Получили значение"); */
      console.log(got);
      //browser.close(); 
      res
          .set({
            'Content-Type': 'text/plain; charset=utf-8',
          })
          .end(String(got));
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

// для экзамена проверка
app.all('/exam/', (req, res) => {
    res.end('a') && res.writeHead(200, {b: 1});
  });

  app.all('*', (req, res) => {
    res.send('strax5');
  });
  
  return app;
}
