export type Category = {
  id?: string;

  externalId?: string;

  name?: string;

  description?: string;

  image?: string;

  visible?: boolean;

  displayOrder?: number;

  path?: string;

  depth?: number;

  parentCategory?: any;

  subCategories?: Category[];
}
// export interface CategoryProductXref {
//   id?: number;
//
//   category?: Category;
//
//   product?: any;
//
//   displayOrder?: number;
// }
//
// export interface ProductOptionXref {
//   id?: number;
//
//   product?: any;
//
//   productOption?: any;
// }
