import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import ProductEditPage from '../../pages/dashboard/catalog/product/edit';
import ProductCreatePage from '../../pages/dashboard/catalog/product/new';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const ProductListPage = lazy(() => import('src/pages/dashboard/catalog/product/list'));
const BrandListPage = lazy(() => import('src/pages/dashboard/catalog/brand/list'));
const CategoryListPage = lazy(() => import('src/pages/dashboard/catalog/category/list'));
const ProductOptionListPage = lazy(() => import('src/pages/dashboard/catalog/product-option/list'));
const ProductOptionCreatePage = lazy(() => import('src/pages/dashboard/catalog/product-option/new'));
const ProductOptionEditPage = lazy(() => import('src/pages/dashboard/catalog/product-option/edit'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'two', element: <IndexPage /> },
      {
        path: 'order',
        children: [
          { element: <IndexPage />, index: true },
          { path: 'abandonedCart', element: <IndexPage /> },
          { path: 'payment', element: <IndexPage /> },
          { path: 'transaction', element: <IndexPage /> },
        ],
      },
      {
        path: 'catalog/product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'catalog/category',
        children: [
          { element: <CategoryListPage />, index: true },
        ],
      },
      {
        path: 'catalog/brand',
        children: [
          { element: <BrandListPage />, index: true },
        ],
      },
      {
        path: 'catalog/product-option',
        children: [
          { element: <ProductOptionListPage />, index: true },
          { path: 'new', element: <ProductOptionCreatePage /> },
          { path: ':id/edit', element: <ProductOptionEditPage /> },
        ],
      },
      {
        path: 'customer',
        children: [
          { element: <IndexPage />, index: true },
        ],
      },
      {
        path: 'user',
        children: [
          { element: <IndexPage />, index: true },
        ],
      },

    ],
  },
];
