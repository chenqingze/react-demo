import { Helmet } from 'react-helmet-async';

import { ProductOptionListView } from '../../../../sections/catalog/product-option/view';


export default function ProductOptionListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Product Option List</title>
      </Helmet>

      <ProductOptionListView />
    </>
  );
}
