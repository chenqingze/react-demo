import { Helmet } from 'react-helmet-async';

import { ProductCreateView } from 'src/sections/catalog/product/view';

export default function ProductCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new product</title>
      </Helmet>

      <ProductCreateView />
    </>
  );
}
