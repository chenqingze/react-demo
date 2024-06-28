// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    session: {
      login: `${ROOTS.AUTH}/session/login`,
      register: `${ROOTS.AUTH}/session/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    one: `${ROOTS.DASHBOARD}/one`,
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      abandonedCart: `${ROOTS.DASHBOARD}/order/abandoned-cart`,
      payment: `${ROOTS.DASHBOARD}/order/payment`,
      transaction: `${ROOTS.DASHBOARD}/order/transaction`,
    },
    catalog: {
      root: `${ROOTS.DASHBOARD}/catalog`,
      product: {
        root: `${ROOTS.DASHBOARD}/catalog/product`,
        new: `${ROOTS.DASHBOARD}/catalog/product/new`,
        details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
        edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
        // demo: {
        //   details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        //   edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
        // },
      },
      category: {
        root: `${ROOTS.DASHBOARD}/catalog/category`,
      },
      brand: {
        root: `${ROOTS.DASHBOARD}/catalog/brand`,
      },
      productOption: {
        root: `${ROOTS.DASHBOARD}/catalog/product-option`,
        new: `${ROOTS.DASHBOARD}/catalog/product-option/new`,
        edit: (id: string) => `${ROOTS.DASHBOARD}/catalog/product-option/${id}/edit`,
        details: (id: string) => `${ROOTS.DASHBOARD}/catalog/product-option/${id}`,
      },
    },
    customer: {
      root: `${ROOTS.DASHBOARD}/customer`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
    },

  },
};
