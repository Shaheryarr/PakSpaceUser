import React from 'react';
import Routes from './src/routes';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NativeBaseProvider>
          <Routes />
        </NativeBaseProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;