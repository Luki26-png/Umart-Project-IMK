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
            // Map retrieved data to ProductCardProps and update this.cardList
            this.cardList = retrievedData.map(data => ({
                id: data.id,
                name: data.name,
                summary: data.summary,
                cover: data.cover,
                category: data.category,
            } as ProductCardProps));

            return this.cardList;
        } catch (error) {
            console.error(`Error retrieve product Card List, from ProductCardList.retrieveCardList\n`, error);
            return [];
        }
    }

    /**
     * Retrieves a list of product cards, excluding a product with a specific ID.
     * The number of cards retrieved is limited by this.cardLimit.
     * @param idToExclude The ID of the product to exclude from the list.
     * @returns A promise that resolves to an array of ProductCardProps.
     */
    public async retrieveCardListExcludingId(idToExclude: number): Promise<ProductCardProps[]> {
        try {
            const retrievedData = await this.productService.retrieveProductCardDataExcludingId(this.cardLimit, idToExclude);

            if (retrievedData.length === 0) {
                console.log(`No products found (excluding ID: ${idToExclude}), from ProductCardListModel.retrieveCardListExcludingId`);
                this.cardList = []; // Clear or set to empty if no results
                return this.cardList;
            }

            this.cardList = retrievedData.map(data => ({
                id: data.id,
                name: data.name,
                summary: data.summary,
                cover: data.cover,
                category: data.category,
            } as ProductCardProps));
            return this.cardList;
        } catch (error) {
            console.error(`Error retrieving product card list (excluding ID: ${idToExclude}), from ProductCardListModel.retrieveCardListExcludingId\n`, error);
            return [];
        }
    }
}

export default ProductCardListModel;