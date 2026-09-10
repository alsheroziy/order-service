export interface CreateProductDto {
  name: string;
  price: number;
  stock_quantity: number;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  stock_quantity?: number;
}
