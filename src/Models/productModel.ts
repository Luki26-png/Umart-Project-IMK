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

    // public getName(): string {
    //     return this.props.name;
    // }

    // public getDescription(): string {
    //     return this.props.description;
    // }

    // public getSummary(): string {
    //     return this.props.summary;
    // }

    // public getCover(): string {
    //     return this.props.cover;
    // }

    // public getCategory(): string {
    //     return this.props.category;
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

export default Product;