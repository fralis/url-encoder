
<br />
<p align="center">
  <a href="https://github.com/fralis/url-encoder">
<img src="https://i.ibb.co/Gx7p9D8/logo.png" alt="logo" border="0" width="100">
  </a>
</p>
<h3 align="center">URL Encoder / Decoder</h3>

  <p align="center">
    A lightweight and complete tool written in JavaScript for URL Encoding and Decoding
  </p>

<!-- TABLE OF CONTENTS -->
## Table of Contents
1. [**Prerequisites**](#prerequisites)
2. [**Installation**](#installation)  
3. [**Usage**](#usage) <br/>
   ⇾ [Encode a URL](#encode) <br/>
   ⇾ [Decode a URL](#decode) 
4. [**Configuration**](#configuration) <br/>
   ⇾ [URL Validation](#urlvalidation) <br/>
   ⇾ [Param Key Validation](#paramkeyvalidation) <br/>
   ⇾ [Reserved Chars](#reservedchars) <br/>
   ⇾ [Auto Question Mark](#autoquestionmark) <br/>
   ⇾ [x-www-form-urlencoded](#xformurlencoded) <br/>
   ⇾ [RFC 3986 Compatibility](#RFC3986) <br/>
   ⇾ [Reset Configuration](#reset)
5. [**Roadmap**](#roadmap)
6. [**Contributing**](#contributing) <br/>
   ⇾ [Testing](#testing) <br/>
7. [**License**](#license)
8. [**Contact**](#contact)
9. [**References & Acknowledgements**](#acknowledgements)

<a name="prerequisites"></a>
# Prerequisites
There are no dependencies. Library is written in pure JavaScript with pure functions.

<a name="installation"></a>
# Installation

## Installing via npm
```shell
npm install @fralis/url-encoder
```
and then import it with:
```javascript
const LisURLEncoder = require('@fralis/url-encoder');
```
or
```javascript
import LisURLEncoder from '@fralis/url-encoder';
```
## Including a script

You can download the minified version at [this link](https://raw.githubusercontent.com/fralis/url-encoder/master/url-encoder.min.js) and then include in your html.

```html
<script type="text/javascript" src="url-encoder.js"></script>
```
and then use directly the class `LisURLEncoder`.

<a name="usage"></a>
# Usage

Importing the library you have the possibility to use the class `LisURLEncoder` that's composed only by two static methods: `encode` and `decode`.

<a name="encode"></a>
## Encode a URL 🠖 `encode(baseURL, queryArray)`
To encode a URL the best course of action is to separate the base URL from the queryString. 
In this way we can avoid bad interpretations in the coding phase.
### Syntax
```javascript
LisURLEncoder.encode(baseURL, queryArray);
```
### Parameters

| Parameter  | Description                                                         | Type                        |
|------------|---------------------------------------------------------------------|-----------------------------|
| `baseURL`    | The base URL without the query string                               | `string`                      |
| `queryArray` | An array of objects containing the list of query string parameters  | `Array<{key:string,value:string}>` |

### Returns

A new string representing the provided `baseURL` and the `queryArray` encoded as a URI.

### Example of Use

```javascript
const baseURL = "https://www.google.com/search";
const queryArray =  [
	{ key: "q", value: "lisandro francesco" }
];
const URL = LisURLEncoder.encode(baseURL, queryArray);
console.log(URL); // > https://www.google.com/search?q=lisandro%20francesco
```
<a name="decode"></a>
## Decode a URL 🠖 `decode(encodedURL)`
The `decode()` function decodes a URI previously encoded to a base URL and an array of parameters of the query string.
### Syntax
```javascript
LisURLEncoder.decode(encodedURL);
```
### Parameters

| Parameter  | Description                                                         | Type                        |
|------------|---------------------------------------------------------------------|-----------------------------|
| `encodedURL`| A previously encoded URL                             | `string`                      |

### Returns

An object containing the following properties:

| Property  | Description                                                         | Type                        |
|------------|---------------------------------------------------------------------|-----------------------------|
| `baseURL`    | The base URL without the query string                               | `string`                      |
| `queryArray` | An array of objects containing the list of query string parameters  | `Array<{key:string,value:string}>` |

### Example of Use

```javascript
const result = LisURLEncoder.decode(
      "https://www.google.com/search?q=lisandro+francesco&oq=lisandro+francesco&aqs=chrome..69i57i60l3j69i65.9413j0j1&sourceid=chrome&ie=UTF-8"
    );
console.log(result);
/*
{
      baseURL: "https://www.google.com/search",
      queryString: [
        { key: "q", value: "lisandro francesco" },
        { key: "oq", value: "lisandro francesco" },
        { key: "aqs", value: "chrome..69i57i60l3j69i65.9413j0j1" },
        { key: "sourceid", value: "chrome" },
        { key: "ie", value: "UTF-8" },
      ],
    }
*/
```

<a name="configuration"></a>
# Configuration
The library allows you to manage some validations on the inputs and certain parameters regarding the encoding. 
Obviously, you can change all of them to modify the behavior of the library.
<a name="urlvalidation"></a>
## URL Validation 🠖 `URL_REGEX`
By default, `encode` and `decode` methods validate respectively the `baseURL` and the `encodedURL` specified via the static property `LisURLEncoder.URL_REGEX`. Its default value is the following:
```javascript
LisURLEncoder.URL_REGEX =
    "^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)" +
    "(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62}" +
    ")?[a-z0-9\\u00a1-\\uffff]\\.)+(?:[a-z\\u00a1-\\uffff]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?$";
```
### Safe Returns
- If `baseURL` does not respect the `URL_REGEX`, the `encode` method returns an empty string. 
- If `encodedURL` does not respect the `URL_REGEX`, the `decode` method returns a `null` object.

<a name="paramkeyvalidation"></a>
## Parameter Key Validation 🠖 `PARAM_KEY_REGEX`
By default, the `encode` method validate each key of the `queryArray` according to the regex specified in `LisURLEncoder.PARAM_KEY_REGEX`. Its default value is the following:
```javascript
LisURLEncoder.PARAM_KEY_REGEX = "^[a-zA-Z0-9]*$";
```
### Safe Returns
- If one of the key in the `queryArray` does not respect the `PARAM_KEY_REGEX`, the `encode` method returns an empty string.

<a name="reservedchars"></a>
## Reserved Chars 🠖 `RESERVED_CHARS`
By default, the `encode` method checks if the `baseURL` contains one of the reserved chars specified in `LisURLEncoder.RESERVED_CHARS`. Its default value is the following:
```javascript
LisURLEncoder.RESERVED_CHARS = ["&", "=", "?", "+"];
```
### Safe Returns
- If one of the reserved char is present in the `baseURL` specified, the `encode` method returns an empty string.

<a name="autoquestionmark"></a>
## Auto Question Mark 🠖 `AUTO_QUESTION_MARK`
By default, the `encode` method add the question mark `?` after the `baseURL` to separate if from the query string.
If you want to avoid it you can set the `LisURLEncoder.AUTO_QUESTION_MARK` to `false`. Its default value is the following:
```javascript
LisURLEncoder.AUTO_QUESTION_MARK = true;
```
<a name="xformurlencoded"></a>
## x-www-form-urlencoded 🠖 `X_WWW_FORM_URLENCODED`
By default, spaces in the parameters values are replaced by `%20` char. For [`application/x-www-form-urlencoded`](https://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#application/x-www-form-urlencoded-encoding-algorithm),
spaces are to be replaced by `+`. You can set `LisURLEncoder.X_WWW_FORM_URLENCODED` to `true` to make this change. Its default value is the following:
```javascript
LisURLEncoder.X_WWW_FORM_URLENCODED = false;
```
<a name="RFC3986"></a>
## RFC 3986 Compatibility 🠖 `RFC3986`
By default, the property `LisURLEncoder.RFC3986` is equal to `true`. Its purpose is to make the encoding more stringent in adhering to [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986) (which reserves `!`, `'`, `(`, `)`, and `*`), 
even though these characters have no formalized URI delimiting uses. You can set it to `false` to avoid this replacing.

<a name="reset"></a>
## Reset Configuration 🠖 `reset()`
You can reset the configuration to default values using the following function:
```javascript
LisURLEncoder.reset();
```
<a name="roadmap"></a>
# Roadmap

See the [open issues](https://github.com/fralis/url-encoder/issues) for a list of proposed features (and known issues).

<a name="contributing"></a>
# Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<a name="testing"></a>
## Testing
Tests can be executed with `npm test`. The library uses [Mocha](https://mochajs.org/).

<a name="license"></a>
# License

Distributed under the MIT License. See `LICENSE` for more information.

<a name="contact"></a>
# Contact

If you like, You can send to me an [email](francesco@youdede.eu).

<a name="acknowledgements"></a>
# References & Acknowledgements
The library uses the following functions to perform the encoding/decoding.

* Function [encodeURI()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)
* Function [encodeURIComponent()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
* Function [decodeURI()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI)
* Function [decodeURIComponent()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)

