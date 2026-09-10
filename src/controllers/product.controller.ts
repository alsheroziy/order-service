import { Request, Response } from 'express';
import asyncHandler from '@/utils/async-handler';
import productService from '@/services/product.service';
import { StatusCode } from '@/enums/status-code.enum';

export const createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const product = await productService.createProduct(req.body);
  res.status(StatusCode.Created).json(product);
});

export const getProductById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const product = await productService.getProductById(id);
  res.status(StatusCode.Ok).json(product);
});

export const getAllProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const offset = req.query.offset ? Number(req.query.offset) : 0;
  const products = await productService.getAllProducts(limit, offset);
  res.status(StatusCode.Ok).json(products);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const updated = await productService.updateProduct(id, req.body);
  res.status(StatusCode.Ok).json(updated);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  await productService.deleteProduct(id);
  res.status(StatusCode.Ok).json({ message: 'product deleted successfully' });
});
