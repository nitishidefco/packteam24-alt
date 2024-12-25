// --------------- LIBRARIES ---------------
import {persistStore, persistReducer} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import {configureStore} from '@reduxjs/toolkit';
// --------------- ASSETS ---------------
import rootSaga from './Sagas';
import rootReducer from './Reducers';
import {reduxStorage} from './Storage';

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

// Create store ----->>>>>
export const Store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false}).concat(sagaMiddleware),
});

// Persistor contains all the data from store ----->>>>>
export const Persistor = persistStore(Store);
sagaMiddleware.run(rootSaga); // Run Saga
