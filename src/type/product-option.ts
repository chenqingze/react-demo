export const PRODUCT_OPTION_TYPES = ['COLOR', 'SIZE', 'DATE', 'TEXT', 'TEXTAREA', 'BOOLEAN', 'INTEGER', 'INPUT', 'PRODUCT', 'SELECT'] as const;
export type ProductOptionType = typeof PRODUCT_OPTION_TYPES[number];

export type ProductOptionValue = {
  id?: string

  attributeValue: string

  displayOrder?: number

  priceAdjustment?: string

  productOption?: ProductOption
}

export type ProductOption = {
  id?: string

  name?: string

  type: ProductOptionType

  attributeName: string

  label?: string

  required?: boolean

  useInSkuGeneration?: boolean

  displayOrder?: number

  allowedValues?: ProductOptionValue[]

}
