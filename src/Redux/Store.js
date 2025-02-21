// --------------- LIBRARIES ---------------
import {persistStore, persistReducer} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import {configureStore} from '@reduxjs/toolkit';
// --------------- ASSETS ---------------
import rootSaga from './Sagas';
import rootReducer from './Reducers';
import {reduxStorage} from './Storage';
import reactotron from '../../ReactotronConfig';

// Root reducer with persist config
const reducers = persistReducer(
  {
    key: 'root',
    storage: reduxStorage,
    // whitelist: ['Cat'],
  },
  rootReducer,
);

// Middlewares setup
const sagaMiddleware = createSagaMiddleware();

/* ---------------------------- Reactactron setup --------------------------- */
const createEnhancers = getDefaultEnhancers => {
  if (__DEV__) {
    const reactotron = require('../../ReactotronConfig').default;
    return getDefaultEnhancers().concat(reactotron.createEnhancer());
  } else {
    return getDefaultEnhancers();
  }
};

// Create store ----->>>>>
export const Store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}).concat(sagaMiddleware),
  enhancers: createEnhancers,
});

reactotron.log('Store initialized:', Store.getState());

// Persistor contains all the data from store ----->>>>>
export const Persistor = persistStore(Store);
sagaMiddleware.run(rootSaga); // Run Saga
