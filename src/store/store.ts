import { configureStore } from "@reduxjs/toolkit";

import loginReducer from "./loginSlice";
import appConfigReducer from "./appConfigSlice";
const store = configureStore({
  reducer: {
    login: loginReducer,
    appConfig: appConfigReducer,
  },
});
export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// @ts-ignore used for debug
window.appStore = store;
