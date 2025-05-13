import express from 'express'
import HomePageController from '../Controllers/homePageController'

const homepage = express.Router();
const homePageController = new HomePageController();
homepage.use('/public',express.static(__dirname + '/../Public'));
homepage.get('/', homePageController.showHomePage);

export default homepage;
