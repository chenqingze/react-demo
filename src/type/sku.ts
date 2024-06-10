export const inventoryTypes = ['ALWAYS_AVAILABLE', 'UNAVAILABLE', 'CHECK_QUANTITY'] as const;
export type InventoryType = typeof inventoryTypes[keyof typeof inventoryTypes];

export type SkuAttribute = {
  id?: string;

  name?: string;

  value?: string;

  sku?: any;
}

export type Dimension = {
  width?: number

  height?: number

  depth?: number

  girth?: number

  size?: string

  container?: string

  dimensionUnitOfMeasure?: string
}
export type Weight = {
  weight?: number;

  weightUnitOfMeasure?: string;
}

export type Sku = {
  id?: number;

  externalId?: string;

  upc?: string;

  salePrice?: number;

  retailPrice?: number;

  cost?: number;

  name?: string;

  description?: string;

  longDescription?: string;

  discountable?: boolean;

  dimension?: Dimension;

  weight?: Weight;

  imageUrls?: string[];

  /**
   * This will be non-null if and only if this Sku is the default Sku for a Product
   */
  defaultProduct?: any;

  /**
   * This relationship will be non-null if and only if this Sku is contained in the list of
   * additional Skus for a Product (for Skus based on ProductOptions)
   */
  product?: any;

  skuAttributes?: SkuAttribute[];

  // productOptionValueXrefs?: SkuProductOptionValueXref[];

  // legacyProductOptionValues?: ProductOptionValue[];

  inventoryType?: InventoryType;

  quantityAvailable?: number;
}
