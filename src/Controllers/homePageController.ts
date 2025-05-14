import { Request, Response } from "express";
import ProductCardListModel from "../Models/productCardModel";

class HomePageController{
    public async showHomePage(req: Request, res: Response):Promise<void>{
        let productCardLimit:number = 3;
        try {
            const productCardListModel = new ProductCardListModel(productCardLimit);
            const cardList = await productCardListModel.retrieveCardList();
            //console.log(cardList);
            //true if use has logged in
            if (req.session.user_id) {
                let userName = req.session.username;
                res.render('user/homepage.pug', {name:userName, cardList:cardList});
            }else{
                res.render('user/homepage.pug', {name:null, cardList:cardList});
            }  
        } catch (_error) {
            res.send("<h1>Server Error</h1>");
            throw new Error("Error tryng to show homepage, from HomePageController.showHomePage");
        }
    }
}

export default HomePageController;