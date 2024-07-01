export const paths = {
  home: '/',
  checkout: '/checkout',
  contact: '/contact',
  pricing: '/pricing',
  auth: {
    custom: {
      signIn: '/auth/custom/sign-in',
      signUp: '/auth/custom/sign-up',
      resetPassword: '/auth/custom/reset-password',
    },
    auth0: {
      callback: '/auth/auth0/callback',
      signIn: '/auth/auth0/sign-in',
      signUp: '/auth/auth0/sign-up',
      signOut: '/auth/auth0/sign-out',
      profile: '/auth/auth0/profile',
    },
    cognito: {
      signIn: '/auth/cognito/sign-in',
      signUp: '/auth/cognito/sign-up',
      signUpConfirm: '/auth/cognito/sign-up-confirm',
      newPasswordRequired: '/auth/cognito/new-password-required',
      resetPassword: '/auth/cognito/reset-password',
      updatePassword: '/auth/cognito/update-password',
    },
    firebase: {
      signIn: '/auth/firebase/sign-in',
      signUp: '/auth/firebase/sign-up',
      resetPassword: '/auth/firebase/reset-password',
      recoveryLinkSent: '/auth/firebase/recovery-link-sent',
      updatePassword: '/auth/firebase/update-password',
    },
    supabase: {
      callback: { implicit: '/auth/supabase/callback/implicit', pkce: '/auth/supabase/callback/pkce' },
      signIn: '/auth/supabase/sign-in',
      signUp: '/auth/supabase/sign-up',
      signUpConfirm: '/auth/supabase/sign-up-confirm',
      resetPassword: '/auth/supabase/reset-password',
      recoveryLinkSent: '/auth/supabase/recovery-link-sent',
      updatePassword: '/auth/supabase/update-password',
    },
    samples: {
      signIn: { centered: '/auth/samples/sign-in/centered', split: '/auth/samples/sign-in/split' },
      signUp: { centered: '/auth/samples/sign-up/centered', split: '/auth/samples/sign-up/split' },
      updatePassword: {
        centered: '/auth/samples/update-password/centered',
        split: '/auth/samples/update-password/split',
      },
      resetPassword: { centered: '/auth/samples/reset-password/centered', split: '/auth/samples/reset-password/split' },
      verifyCode: { centered: '/auth/samples/verify-code/centered', split: '/auth/samples/verify-code/split' },
    },
  },
  dashboard: {
    overview: '/dashboard',
    settings: {
      account: '/dashboard/settings/account',
      billing: '/dashboard/settings/billing',
      integrations: '/dashboard/settings/integrations',
      notifications: '/dashboard/settings/notifications',
      security: '/dashboard/settings/security',
      team: '/dashboard/settings/team',
    },
    academy: { browse: '/dashboard/academy', details: (courseId) => `/dashboard/academy/courses/${courseId}` },
    analytics: '/dashboard/analytics',
    blank: '/dashboard/blank',
    blog: {
      list: '/dashboard/blog',
      details: (postId) => `/dashboard/blog/${postId}`,
      create: '/dashboard/blog/create',
    },
    calendar: '/dashboard/calendar',
    chat: {
      base: '/dashboard/chat',
      compose: '/dashboard/chat/compose',
      thread: (threadType, threadId) => `/dashboard/chat/${threadType}/${threadId}`,
    },
    crypto: '/dashboard/crypto',
   
    eCommerce: '/dashboard/e-commerce',
    fileStorage: '/dashboard/file-storage',
    invoices: {
      list: '/dashboard/invoices',
      create: '/dashboard/invoices/create',
      details: (invoiceId) => `/dashboard/invoices/${invoiceId}`,
    },
    jobs: {
      browse: '/dashboard/jobs',
      create: '/dashboard/jobs/create',
      companies: {
        overview: (companyId) => `/dashboard/jobs/companies/${companyId}`,
        reviews: (companyId) => `/dashboard/jobs/companies/${companyId}/reviews`,
        activity: (companyId) => `/dashboard/jobs/companies/${companyId}/activity`,
        team: (companyId) => `/dashboard/jobs/companies/${companyId}/team`,
        assets: (companyId) => `/dashboard/jobs/companies/${companyId}/assets`,
      },
    },
    logistics: { metrics: '/dashboard/logistics', fleet: '/dashboard/logistics/fleet' },
    mail: {
      list: (label) => `/dashboard/mail/${label}`,
      details: (label, emailId) => `/dashboard/mail/${label}/${emailId}`,
    },
    orders: {
      list: '/dashboard/orders',
      create: '/dashboard/orders/create',
      preview: (orderId) => `/dashboard/orders?previewId=${orderId}`,
      details: (orderId) => `/dashboard/orders/${orderId}`,
    },
    products: {
      list: '/dashboard/products',
      create: '/dashboard/products/create',
      preview: (productId) => `/dashboard/products?previewId=${productId}`,
      details: (productId) => `/dashboard/products/${productId}`,
    },
    social: {
      profile: { timeline: '/dashboard/social/profile', connections: '/dashboard/social/profile/connections' },
      feed: '/dashboard/social/feed',
    },
    tasks: '/dashboard/tasks',

  //// tabs 
  companyinformation: {
    list: '/dashboard/company/edit',
    create: '/dashboard/course-categories/edit',
    edit : (companyId) => `/dashboard/course-categories/edit/${companyId}`,
  },
  coursecategories: {
    list: '/dashboard/course-categories',
    create: '/dashboard/course-categories/create',
    edit : (courseCategoryId) => `/dashboard/course-categories/edit/${courseCategoryId}`,
  },
  courses: {
    list: '/dashboard/courses',
    create: '/dashboard/courses/create',
    edit : (courseId) => `/dashboard/courses/edit/${courseId}`,
  },
  countries: {
    list: '/dashboard/countries',
    create: '/dashboard/countries/create',
    edit : (countryId) => `/dashboard/countries/edit/${countryId}`,
  },
  states: {
    list: '/dashboard/states',
    create: '/dashboard/states/create',
    edit : (stateId) => `/dashboard/states/edit/${stateId}`,
  },
  cities: {
    list: '/dashboard/cities',
    create: '/dashboard/cities/create',
    edit : (cityId) => `/dashboard/cities/edit/${cityId}`,
  },
  taxes: {
    list: '/dashboard/taxes',
    create: '/dashboard/taxes/create',
    edit : (taxId) => `/dashboard/taxes/edit/${taxId}`,
  },
  currencies: {
    list: '/dashboard/currencies',
    create: '/dashboard/currencies/create',
    edit : (currencyId) => `/dashboard/currencies/edit/${currencyId}`,
  },
  timezones: {
    list: '/dashboard/timezones',
    create: '/dashboard/timezones/create',
    edit : (timezoneId) => `/dashboard/timezones/edit/${timezoneId}`,
  },
  emailapi: {
    list: '/dashboard/emailapi',
    create: '/dashboard/emailapi/create',
    edit : (timezoneId) => `/dashboard/emailapi/edit/${timezoneId}`,
  },
  paymentapi: {
    list: '/dashboard/paymentapi',
    create: '/dashboard/paymentapi/create',
    edit : (timezoneId) => `/dashboard/paymentapi/edit/${timezoneId}`,
  },
  instructors: {
    list: '/dashboard/instructors',
    create: '/dashboard/instructors/create',
    edit : (timezoneId) => `/dashboard/instructors/edit/${timezoneId}`,
  },
  vendors: {
    list: '/dashboard/vendors',
    create: '/dashboard/vendors/create',
    edit : (vendorId) => `/dashboard/vendors/edit/${vendorId}`,
  },
  coupons: {
    list: '/dashboard/coupons',
    create: '/dashboard/coupons/create',
    edit : (couponId) => `/dashboard/coupons/edit/${couponId}`,
  },
  systememails: {
    list: '/dashboard/systememails',
    create: '/dashboard/coupons/create',
    edit : (couponId) => `/dashboard/coupons/edit/${couponId}`,
  },
  
  eventmanagement: {
    list: '/dashboard/event-management',
    create: '/dashboard/event-management/create',
    edit : (eventmanagementId) => `/dashboard/event-management/edit/${eventmanagementId}`,
  },
  waitlist: {
    list: '/dashboard/waitlist',
    create: '/dashboard/waitlist/create',
    edit : (eventmanagementId) => `/dashboard/waitlist/edit/${eventmanagementId}`,
  },
  abandonedcart: {
    list: '/dashboard/abandoned-cart',
    create: '/dashboard/abandonedcart/create',
    edit : (eventmanagementId) => `/dashboard/abandonedcart/edit/${eventmanagementId}`,
  },
  orders: {
    list: '/dashboard/orders',
    create: '/dashboard/orders/create',
    details : (orderId) => `/dashboard/orders/${orderId}`,
    edit : (orderId) => `/dashboard/orders/edit/${orderId}`,
    transfer : (orderId) => `/dashboard/orders/${orderId}/transfer`,
    cancel : (orderId) => `/dashboard/orders/${orderId}/cancel`,
    invoice : (orderId) => `/dashboard/orders/${orderId}/invoice`,
    history : (orderId) => `/dashboard/orders/${orderId}/history`,
     email : (orderId) => `/dashboard/orders/${orderId}/email`,
  },





  //// tabs




  },
  pdf: { invoice: (invoiceId) => `/pdf/invoices/${invoiceId}` },
  components: {
    index: '/components',
    buttons: '/components/buttons',
    charts: '/components/charts',
    colors: '/components/colors',
    detailLists: '/components/detail-lists',
    forms: '/components/forms',
    gridLists: '/components/grid-lists',
    groupedLists: '/components/grouped-lists',
    inputs: '/components/inputs',
    modals: '/components/modals',
    quickStats: '/components/quick-stats',
    tables: '/components/tables',
    typography: '/components/typography',
  },
  notAuthorized: '/errors/not-authorized',
  notFound: '/errors/not-found',
  internalServerError: '/errors/internal-server-error',
  docs: 'https://material-kit-pro-react-docs.devias.io',
  purchase: 'https://mui.com/store/items/devias-kit-pro',
};
