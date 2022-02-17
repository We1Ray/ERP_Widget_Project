import { createSelectorHook, useDispatch } from "react-redux";
import PublicMethod from "../../methods/PublicMethod";

interface SystemProps {
  /**
   * 使用者的登入Token
   */
  token: string;
  /**
   * 系統UID
   */
  system_uid: string;
  /**
   * 廠別資訊
   */
  factory: {
    uid: string;
    name: string;
    ip: string;
  };
  /**
   * 登入者狀態
   */
  userstate: string;
  /**
   * 目前系統是否需登入
   */
  mustlogin: boolean;
  /**
   * 語言
   */
  lang: string;
  /**
   * 語系表
   */
  localization: any[];
  /**
   * 輸入來源、字元、語言取得對應的語系顯示值
   */
  getLocalization: (source: string, word: string, language?: string) => string;
  /**
   * 使用者權限
   */
  authority: any[];
  /**
   * 是否完全載入系統資訊
   */
  isLoaded: boolean;
}
const SystemInitialState = {
  token: "",
  system_uid: "",
  factory: {
    uid: "",
    name: "",
    ip: "",
  },
  userstate: "",
  mustlogin: false,
  lang: "TW",
  localization: [],
  getLocalization: (source: string, word: string, language = "") => {
    return "";
  },
  authority: [],
  isLoaded: false,
};

function SystemReducer(
  state = SystemInitialState,
  action: { type: any; value: any }
) {
  switch (action.type) {
    case "token":
      return { ...state, token: action.value };
    case "system_uid":
      return { ...state, system_uid: action.value };
    case "factory":
      return { ...state, factory: action.value };
    case "userstate":
      return { ...state, userstate: action.value };
    case "mustlogin":
      return { ...state, mustlogin: action.value };
    case "lang":
      return {
        ...{ ...state, lang: action.value },
        getLocalization: (
          source: string | number,
          word: string | number,
          language = ""
        ) => {
          if (PublicMethod.checkValue(language)) {
            let wordValue = checkWord(
              state.localization,
              source,
              word,
              language
            );
            if (PublicMethod.checkValue(wordValue)) {
              return wordValue;
            } else {
              return checkWord(state.localization, source, word, "TW");
            }
          } else {
            let wordValue = checkWord(
              state.localization,
              source,
              word,
              action.value
            );
            if (PublicMethod.checkValue(wordValue)) {
              return wordValue;
            } else {
              return checkWord(state.localization, source, word, "TW");
            }
          }
        },
      };
    case "localization":
      return {
        ...{ ...state, localization: action.value },
        getLocalization: (
          source: string | number,
          word: string | number,
          language = ""
        ) => {
          if (PublicMethod.checkValue(language)) {
            let wordValue = checkWord(action.value, source, word, language);
            if (PublicMethod.checkValue(wordValue)) {
              return wordValue;
            } else {
              return checkWord(action.value, source, word, "TW");
            }
          } else {
            let wordValue = checkWord(action.value, source, word, state.lang);
            if (PublicMethod.checkValue(wordValue)) {
              return wordValue;
            } else {
              return checkWord(action.value, source, word, "TW");
            }
          }
        },
      };
    case "authority":
      return { ...state, authority: action.value };
    case "isLoaded":
      return { ...state, isLoaded: action.value };
    default:
      return state;
  }
}

const useSystemSelector = createSelectorHook<any>();

interface stateProps {
  system?: SystemProps;
  [x: string]: any;
}

const useSystem = () => {
  const System = useSystemSelector((state: stateProps) => ({
    token: state.system.token,
    system_uid: state.system.system_uid,
    factory: state.system.factory,
    userstate: state.system.userstate,
    mustlogin: state.system.mustlogin,
    lang: state.system.lang,
    localization: state.system.localization,
    getLocalization: state.system.getLocalization,
    authority: state.system.authority,
    isLoaded: state.system.isLoaded,
  }));
  const dispatch = useDispatch();
  const SystemDispatch = (state: any) => {
    dispatch({ type: state.type, value: state.value });
  };
  return { System, SystemDispatch };
};

function checkWord(
  localization: any[],
  source: string | number,
  word: string | number,
  language: string
) {
  if (PublicMethod.checkValue(language)) {
    if (localization[language]) {
      if (localization[language][source]) {
        if (localization[language][source][word]) {
          return localization[language][source][word];
        } else {
          return "";
        }
      } else {
        return "";
      }
    } else {
      return "";
    }
  }
}

export { useSystem, SystemReducer };
export type { SystemProps };
