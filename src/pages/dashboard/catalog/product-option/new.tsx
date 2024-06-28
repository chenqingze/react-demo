import { Helmet } from 'react-helmet-async';

import { ProductOptionCreateView } from '../../../../sections/catalog/product-option/view';

export default function ProductOptionCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new product option</title>
      </Helmet>

      <ProductOptionCreateView />
    </>
  );
}
