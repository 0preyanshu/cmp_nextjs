'use client';

import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from '@/redux/store';
// import Layout from './dashboard/layout';
import  Loading  from '@/components/core/loading';

const ClientLayout = ({ children }) => {
  let persistor = persistStore(store);
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<Loading></Loading>} persistor={persistor}>
        {children}
      </PersistGate>
    </ReduxProvider>
  );
};

export default ClientLayout;
