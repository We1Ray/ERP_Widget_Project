import { combineReducers } from "redux";

import settingsReducer from "./settings.reducer";
import themesReducer from "./themes.reducers";
import { SystemReducer } from "../../resource/index";

export default combineReducers({
  settings: settingsReducer,
  theme: themesReducer,
  system: SystemReducer,
});
