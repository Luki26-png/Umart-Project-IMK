import { ProductService } from "../Config/db";

interface ProductCardProps{
    id: number;
    name: string;
    summary: string;
    cover: string;
    category: string;
}

class ProductCardListModel{
    private cardLimit: number;
    private productService : ProductService;
    private cardList: ProductCardProps[] = [];

    constructor(cardLimit:number){
        this.cardLimit = cardLimit
        this.productService = new ProductService();
    }

    public async retrieveCardList():Promise<ProductCardProps[]>{
        try {
            const retrievedData = await this.productService.retriveProductCardData(this.cardLimit);
            if (retrievedData.length == 0) {
                console.log("The products table in database is empty, from ProductCardList.retrieveCardList");
                return [];
            }
            console.log("disini kepanggil")
            //loop through retrieve array of Data and put it into cadList 
            for (let index = 0; index < retrievedData.length; index++) {
                this.cardList.push(<ProductCardProps>{
                    id: retrievedData[index].id,
                    name: retrievedData[index].name,
                    summary: retrievedData[index].summary,
                    cover: retrievedData[index].cover,
                    category: retrievedData[index].category,
                });
            }
            return this.cardList;
        } catch (error) {
            console.error(`Error retrieve product Card List, from ProductCardList.retrieveCardList\n`, error);
            return [];
        }
    }
}

export default ProductCardListModel;