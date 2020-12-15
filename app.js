  
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers':
    'x-test,Content-Type,Accept, Access-Control-Allow-Headers',
};

export default function appSrc(express, bodyParser, createReadStream, crypto, http, webdriver) {
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
    
    let options = new chrome.Options();
//Below arguments are critical for Heroku deployment
options.addArguments("--headless");
options.addArguments("--disable-gpu");
options.addArguments("--no-sandbox");
    
      const url = req.query.URL;
      console.log(url);
      let driver = new webdriver.Builder()
          .forBrowser('chrome')
          .setChromeOptions(options)
          .build();
      await driver.get(url);
      const button = driver.wait(
        until.elementLocated(By.id('bt')),
        10000
        );
      button.click();
      const field_inpt = driver.findElement(By.name('inp'))
      const got = field_inpt.value();
      console.log(got);
      await driver.quit();
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


