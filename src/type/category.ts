export type Category = {
  id?: string;

  externalId?: string;

  name: string;

  description?: string;

  imageUrl?: string;

  visible?: boolean;

  displayOrder?: number;

  parentPath?: string;
  fullPath: string;
  depth?: number;
  parentId?: string;
  parentCategory?: any;

  descendantCount: number;
  hierarchy: string []; // 仅用于前端展示，保存分类层级，使用fullPath的‘/’来进行分割成id的数组
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
