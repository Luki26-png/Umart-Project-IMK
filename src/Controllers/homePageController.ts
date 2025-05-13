import { Request, Response } from "express";
import ProductCardListModel from "../Models/productCardModel";

class HomePageController{
    public async showHomePage(req: Request, res: Response):Promise<void>{
        let productCardLimit:number = 3;
        const productCardListModel = new ProductCardListModel(productCardLimit);
        const cardList = await productCardListModel.retrieveCardList();
        console.log(cardList);
        //true if use has logged in
        if (req.session.user_id) {
            const userName = req.session.name;
            res.render('user/homepage.pug', {name:userName, cardList:cardList});
        }else{
            res.render('user/homepage.pug', {name:null, cardList:cardList});
        }
    }
}

export default HomePageController;