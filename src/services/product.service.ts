import { redis } from '@/config/redis.config';
import { CreateProductDto, UpdateProductDto } from '@/dtos/product.dto';
import { IProduct } from '@/interfaces/product.interface';
import productRepo from '@/repositories/product.repo';
import ErrorResponse from '@/utils/errorResponse';

class ProductService {
  private readonly cacheTtl = 3600;

  async createProduct(dto: CreateProductDto): Promise<IProduct> {
    const product = await productRepo.create(dto);
    await redis.set(`product:${product.id}`, JSON.stringify(product), 'EX', this.cacheTtl);
    return product;
  }

  async getProductById(id: string): Promise<IProduct> {
    const cacheKey = `product:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as IProduct;
    }

    const product = await productRepo.findById(id);
    if (!product) {
      throw ErrorResponse.notFound('product not found');
    }

    await redis.set(cacheKey, JSON.stringify(product), 'EX', this.cacheTtl);
    return product;
  }

  async getAllProducts(limit: number = 20, offset: number = 0): Promise<IProduct[]> {
    return productRepo.findAll(limit, offset);
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<IProduct> {
    const updated = await productRepo.update(id, dto);
    if (!updated) {
      throw ErrorResponse.notFound('product not found');
    }

    await this.invalidateCache(id);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const deleted = await productRepo.delete(id);
    if (!deleted) {
      throw ErrorResponse.notFound('product not found');
    }

    await this.invalidateCache(id);
    return true;
  }

  async invalidateCache(id: string): Promise<void> {
    await redis.del(`product:${id}`);
  }
}

export default new ProductService();
