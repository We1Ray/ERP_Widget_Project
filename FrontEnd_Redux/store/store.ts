import { createStore, Store } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";
import { createWrapper } from "next-redux-wrapper";
import reducers from "./reducers/reducers";

export function configureStore(initialState: any) {
  return createStore(reducers, initialState, devToolsEnhancer({}));
}

export const wrapper = createWrapper<Store<any>>(configureStore, {
  debug: false,
});
