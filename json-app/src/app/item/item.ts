export interface Item {
    id: number;
    name: string;
    price: number;
    category: string;
    qty: number;
    stock: number;
    images?: string[];
    coverImage?: string;
}
