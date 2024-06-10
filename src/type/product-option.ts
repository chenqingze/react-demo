export type OptionType = string | 'SELECT' | 'TEXTAREA' | 'BOOLEAN'


export type ProductOptionValue = {
  id?: string

  attributeValue?: string

  displayOrder?: number

  priceAdjustment?: number

  productOption?: ProductOption
}

export type ProductOption = {
  id?: string

  name?: string

  type?: OptionType

  attributeName?: string

  label?: string

  required?: boolean

  useInSkuGeneration?: boolean

  displayOrder?: number

  allowedValues?: ProductOptionValue[]

}
