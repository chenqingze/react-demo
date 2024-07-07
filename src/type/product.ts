import { Sku } from './sku';
import { Brand } from './brand';

export type ProductAttribute = {
  id?: string

  name?: string

  value?: string

  product?: any
}

export type Product = {
  id?: string;
  name?: string;
  imageUrls?: string[];
  description?: string;
  longDescription?: string;
  manufacturer?: string;
  retailPrice?: string;
  salePrice?: string;
  useDefaultSkuInInventory?: boolean;
  brand?: Brand
  brandId: string;
  skus?: Sku[];
  // allParentCategoryXrefs?: CategoryProductXref[]
  allCategoryIds: string[];
  productAttributes?: ProductAttribute[];

  // productOptions?: ProductOptionXref[]

  productOptionMap?: { [x: string]: any }

};

