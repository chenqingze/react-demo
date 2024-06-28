import { Helmet } from 'react-helmet-async';

import { useParams } from '../../../../routes/hooks';
import { ProductOptionEditView } from '../../../../sections/catalog/product-option/view';

export default function ProductOptionEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Product Option Edit</title>
      </Helmet>

      <ProductOptionEditView id={`${id}`} />
    </>
  );
}
