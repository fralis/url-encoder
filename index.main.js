"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LisURLQueryString {
  static encodeParamValue(value) {
    let encoded = LisURLEncoder.RFC3986 ? encodeURIComponent(value).replace(/[!'()*]/g, function (c) {
      return "%" + c.charCodeAt(0).toString(16);
    }) : encodeURIComponent(value);
    return LisURLEncoder.X_WWW_FORM_URLENCODED ? encoded.replace(new RegExp("%20", "g"), "+") : encoded;
  }

  static encode(queryArray) {
    return queryArray.map(function (_ref) {
      let {
        key,
        value
      } = _ref;
      return key + "=" + LisURLQueryString.encodeParamValue(value);
    }).join("&");
  }

  static decode(queryString) {
    return Array.from(new URLSearchParams(queryString)).filter(function (entry) {
      return entry.filter(function (e) {
        return e && e !== "";
      }).length > 0;
    }).map(function (entry) {
      return {
        key: entry[0],
        value: decodeURIComponent(entry[1].replace(/\+/g, " "))
      };
    });
  }

}

class LisURLEncode {
  static queryArray(queryArray) {
    if (queryArray) {
      try {
        return LisURLQueryString.encode(queryArray);
      } catch (e) {
        if (LisURLEncoder.DEBUGGING) {
          console.warn(e);
        }
      }
    }

    return null;
  }

  static baseURL(baseURL) {
    let base = "";

    if (baseURL) {
      try {
        base = encodeURI(baseURL);
      } catch (e) {
        console.warn(e);
      }
    }

    return base;
  }

  static url(baseURL, queryArray) {
    const base = LisURLEncode.baseURL(baseURL);
    const queryString = LisURLEncode.queryArray(queryArray);
    return base + (queryString !== "" && base !== "" ? (LisURLEncoder.AUTO_QUESTION_MARK ? "?" : "") + queryString : "");
  }

}

class LisURLDecode {
  static queryString(url) {
    if (url) {
      try {
        return LisURLQueryString.decode(new URL(url).searchParams.toString());
      } catch (e) {
        if (LisURLEncoder.DEBUGGING) {
          console.warn(e);
        }
      }
    }

    return "";
  }

  static baseURL(url) {
    let base = "";

    if (url) {
      try {
        base = decodeURI(url).split("?")[0];
      } catch (e) {
        if (LisURLEncoder.DEBUGGING) {
          console.warn(e);
        }
      }
    }

    return base;
  }

  static url(url) {
    let baseURL = "";
    let queryString = "";

    if (url && url !== "") {
      baseURL = LisURLDecode.baseURL(url);
      queryString = LisURLDecode.queryString(url);
    }

    return {
      baseURL,
      queryString
    };
  }

}

class LisURLEncoder {
  static decode(url) {
    if (!new RegExp(LisURLEncoder.URL_REGEX, "g").test(url)) {
      if (LisURLEncoder.DEBUGGING) {
        console.warn("The URL specified for decoding is not a URL");
      }

      return null;
    }

    return LisURLDecode.url(url);
  }

  static encode(baseURL, queryArray) {
    const testURL = new RegExp(LisURLEncoder.URL_REGEX, "g").test(baseURL);

    if (!testURL) {
      if (LisURLEncoder.DEBUGGING) {
        console.warn("The base URL specified for encoding is not a URL");
      }

      return "";
    }

    const testReservedChars = LisURLEncoder.RESERVED_CHARS.some(function (c) {
      return baseURL.includes(c);
    });

    if (testReservedChars) {
      if (LisURLEncoder.DEBUGGING) {
        console.warn("The base URL specified contains reserved chars");
      }

      return "";
    }

    const testParamKeys = queryArray.some(function (_ref2) {
      let {
        key
      } = _ref2;
      return new RegExp(LisURLEncoder.PARAM_KEY_REGEX, "g").test(key);
    });

    if (!testParamKeys) {
      if (LisURLEncoder.DEBUGGING) {
        console.warn("Check your param keys because some of them do not respect the validation");
      }

      return "";
    }

    return LisURLEncode.url(baseURL, queryArray);
  }

  static reset() {
    LisURLEncoder.X_WWW_FORM_URLENCODED = false;
    LisURLEncoder.AUTO_QUESTION_MARK = true;
    LisURLEncoder.RFC3986 = true;
    LisURLEncoder.URL_REGEX = "^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)" + "(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" + "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62}" + ")?[a-z0-9\\u00a1-\\uffff]\\.)+(?:[a-z\\u00a1-\\uffff]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?$";
    LisURLEncoder.RESERVED_CHARS = ["&", "=", "?", "+"];
    LisURLEncoder.PARAM_KEY_REGEX = "^[a-zA-Z0-9]*$";
  }

}

_defineProperty(LisURLEncoder, "DEBUGGING", false);

_defineProperty(LisURLEncoder, "X_WWW_FORM_URLENCODED", false);

_defineProperty(LisURLEncoder, "URL_REGEX", "^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)" + "(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" + "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62}" + ")?[a-z0-9\\u00a1-\\uffff]\\.)+(?:[a-z\\u00a1-\\uffff]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?$");

_defineProperty(LisURLEncoder, "RESERVED_CHARS", ["&", "=", "?", "+"]);

_defineProperty(LisURLEncoder, "PARAM_KEY_REGEX", "^[a-zA-Z0-9]*$");

_defineProperty(LisURLEncoder, "AUTO_QUESTION_MARK", true);

_defineProperty(LisURLEncoder, "RFC3986", false);

if (typeof module !== 'undefined') {
  module.exports = LisURLEncoder;
}

var _default = LisURLEncoder;
exports.default = _default;
