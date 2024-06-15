export type Category = {
  id?: string;

  externalId?: string;

  name: string;

  description?: string;

  imageUrl?: string;

  visible?: boolean;

  displayOrder?: number;

  depth?: number;

  parentPath?: string;

  fullPath: string;

  descendantCount: number;

  parentId?: string;

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
