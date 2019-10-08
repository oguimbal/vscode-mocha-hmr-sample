import express from 'express';

// start server
const app = express();
const router = express.Router();
router.get('/', (req, res) => res.send('Hello world'));
app.use('/', router);

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
    console.log(`Express server app listening on port ${port}!`);
});

// handle webpack HMR https://webpack.js.org/api/hot-module-replacement/#dispose-or-adddisposehandler
declare const module: any;
if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        console.log('============= Stoping server for HMR =================');
        server.close();
    });
}
