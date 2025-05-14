import { ProductService} from "../Config/db";
export interface ProductProps{
    id: number;
    name: string;
    description: string;
    price: string;
    summary: string;
    cover: string;
    category: string;
}

class Product{
    private props: ProductProps;
    private productService: ProductService;


    public constructor(props: ProductProps){
        this.validate(props);
        this.props = props;
        this.productService = new ProductService();
    }

    private validate(props: ProductProps){
        if (!props.id || !props.name || !props.description) {
            throw new Error("id, name, and description are required");
        }

        if (props.description.length > 1000){
            throw new Error("product description shouldn't be longger than 1000");            
        }
    }

    // Getters
    // public getId(): number {
    //     return this.props.id;
    // }
    
    //add new product
    public async addNewProduct():Promise<string>{
        try {
          await this.productService.insertToProductTable(this.props);
          return "success adding new product";  
        } catch (error) {
            throw new Error("Failed to add new product ");
        }
    }
    //returning data to controllers
    public toJSON(): ProductProps{
        return {...this.props};
    }
}

export class ProductDetail{
    private productService: ProductService;

    public constructor(){
        this.productService = new ProductService();
    }

    public async getOneProduct(id:number):Promise<ProductProps|null>{
        try {
            const retrieveData = await this.productService.retrieveOneData(id);
            if (retrieveData.length == 0) {
                console.log(`Product with id ${id} doesn't exist, from ProductCardList.getOneProduct`);
                return null;
            }
            const props : ProductProps = {
                cover : retrieveData[0].cover,
                id : retrieveData[0].id,
                name : retrieveData[0].name,
                description : retrieveData[0].description,
                price : retrieveData[0].price,
                summary : retrieveData[0].summary,
                category : retrieveData[0].category   
            }
            return props;
            
        } catch (error) {
            console.error(`error retrieving product with id ${id}, from ProductCardList.getOneProduct`)
            return null;
        }
    }
}

export default Product;