import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings/context';

import { ProductOption } from '../../../../type/product-option';
import ProductOptionNewEditForm from '../product-option-new-edit-form';

type Props = {
  id: string;
};
export default function ProductOptionEditView({ id }: Props) {

  const settings = useSettingsContext();

  const [currentProductOption, setCurrentProductOption] = useState<ProductOption>();

  useEffect(() => {
    axios.get(`${endpoints.productOption}/${id}`).then(({ data }) => setCurrentProductOption(data));
  }, [id]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Product',
            href: paths.dashboard.catalog.productOption.root,
          },
          { name: currentProductOption?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductOptionNewEditForm currentProductOption={currentProductOption} />
    </Container>);
}
