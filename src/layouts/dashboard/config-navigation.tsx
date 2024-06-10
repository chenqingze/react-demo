import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  return useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'overview',
        items: [
          { title: 'one', path: paths.dashboard.root, icon: ICONS.dashboard },
          { title: 'two', path: paths.dashboard.one, icon: ICONS.ecommerce },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'management',
        items: [
          {
            title: 'Orders',
            path: paths.dashboard.order.root,
            icon: ICONS.order,
            children: [
              { title: 'Order List', path: paths.dashboard.order.root },
              { title: 'Payment', path: paths.dashboard.order.payment },
              { title: 'Abandoned Cars', path: paths.dashboard.order.abandonedCart },
              { title: 'Transactions', path: paths.dashboard.order.transaction },
            ],
          },
          {
            title: 'Catalog',
            path: paths.dashboard.catalog.root,
            icon: ICONS.product,
            children: [
              { title: 'Products', path: paths.dashboard.catalog.product.root },
              { title: 'Categories', path: paths.dashboard.catalog.category.root },
              { title: 'Brands', path: paths.dashboard.catalog.brand.root },
              { title: 'Product Options', path: paths.dashboard.catalog.productOption.root },
            ],
          },
          {
            title: 'Customer',
            path: paths.dashboard.customer.root,
            icon: ICONS.user,
            children: [],
          },
          {
            title: 'User',
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [],
          },
        ],
      },
    ],
    [],
  );
}
