import { Sku } from './sku';
import { Brand } from './brand';

export type ProductAttribute = {
  id?: string

  name?: string

  value?: string

  product?: any
}

export type Product = {
  id?: string
  name?: string
  manufacturer?: string

  defaultSku?: Sku

  useDefaultSkuInInventory?: boolean

  skus?: Sku[]

  additionalSkus?: Sku[]

  // allParentCategoryXrefs?: CategoryProductXref[]

  productAttributes?: ProductAttribute[]

  // productOptions?: ProductOptionXref[]

  productOptionMap?: { [x: string]: any }

  brand?: Brand
};

