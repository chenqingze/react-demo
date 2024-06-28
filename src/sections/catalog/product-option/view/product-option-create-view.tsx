import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useSettingsContext } from '../../../../components/settings';
import ProductOptionNewEditForm from '../product-option-new-edit-form';

export default function ProductOptionCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new product option"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Product Option',
            href: paths.dashboard.catalog.productOption.root,
          },
          { name: 'New Product Option' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductOptionNewEditForm />
    </Container>
  );
}
