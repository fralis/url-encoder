const LisURLEncoder = require("./index");
const assert = require("assert").strict;
LisURLEncoder.DEBUGGING = false;

describe("Encoding", function () {
  it("should return encoded URL by base URL and params", function () {
    let URL = LisURLEncoder.encode("https://www.google.com/search", [
      { key: "q", value: "lisandro francesco" },
    ]);
    assert.equal(URL, "https://www.google.com/search?q=lisandro%20francesco");
  });

  it("should return encoded URL with + instead of %20 according to X_WWW_FORM_URLENCODED", function () {
    LisURLEncoder.X_WWW_FORM_URLENCODED = true;
    let URL = LisURLEncoder.encode("https://www.google.com/search", [
      { key: "q", value: "lisandro francesco" },
      { key: "oq", value: "lisandro francesco" },
      { key: "aqs", value: "chrome..69i57j69i60l3j69i65.9413j0j1" },
      { key: "sourceid", value: "chrome" },
      { key: "ie", value: "UTF-8" },
    ]);
    assert.equal(
      URL,
      "https://www.google.com/search?q=lisandro+francesco&oq=lisandro+francesco&aqs=chrome..69i57j69i60l3j69i65.9413j0j1&sourceid=chrome&ie=UTF-8"
    );
    LisURLEncoder.X_WWW_FORM_URLENCODED = false;
  });

  it("should return empty URL if base URL is empty", function () {
    let URL = LisURLEncoder.encode("", [
      { key: "q", value: "lisandro francesco" },
    ]);
    assert.equal(URL, "");
  });

  it("should return empty URL if base URL contain reserved chars", function () {
    let URL = LisURLEncoder.encode("https://www.google.com/search/&=", [
      { key: "q", value: "lisandro francesco" },
    ]);
    assert.equal(URL, "");
  });

  it("should return empty URL if a param key does not respect the regex", function () {
    let URL = LisURLEncoder.encode("https://www.google.com/search", [
      { key: "q&; ", value: "lisandro francesco" },
    ]);
    assert.equal(URL, "");
  });

  it("should return the URL if the base URL regex changes", function () {
    LisURLEncoder.URL_REGEX = "";
    let URL = LisURLEncoder.encode("test", [
      { key: "q", value: "lisandro francesco" },
    ]);
    assert.equal(URL, "test?q=lisandro%20francesco");
    LisURLEncoder.reset();
  });

  it("should return the URL if the param key regex changes", function () {
    LisURLEncoder.PARAM_KEY_REGEX = "";
    let URL = LisURLEncoder.encode("https://www.google.com/search", [
      { key: "q&; ", value: "lisandro francesco" },
    ]);
    assert.equal(
      URL,
      "https://www.google.com/search?q&; =lisandro%20francesco"
    );
    LisURLEncoder.reset();
  });

  it("should return the URL if reserved chars changes", function () {
    LisURLEncoder.RESERVED_CHARS = [];
    let URL = LisURLEncoder.encode("https://www.google.com/search?", [
      { key: "q", value: "lisandro francesco" },
    ]);
    assert.equal(URL, "https://www.google.com/search??q=lisandro%20francesco");
    LisURLEncoder.reset();
  });

  it("should return the URL without ? if AUTO_QUESTION_MARK is false", function () {
    LisURLEncoder.RESERVED_CHARS = [];
    LisURLEncoder.AUTO_QUESTION_MARK = false;
    let URL = LisURLEncoder.encode("https://www.google.com/search?", [
      { key: "q", value: "lisandro francesco" },
    ]);
    assert.equal(URL, "https://www.google.com/search?q=lisandro%20francesco");
    LisURLEncoder.reset();
  });

  it("should not convert !'()* with RFC3986 = false", function () {
    LisURLEncoder.RFC3986 = false;
    let URL = LisURLEncoder.encode("https://www.google.com/search", [
      { key: "q", value: "lisandro !'()* francesco" },
    ]);
    assert.equal(
      URL,
      "https://www.google.com/search?q=lisandro%20!'()*%20francesco"
    );
    LisURLEncoder.reset();
  });
});

describe("Decoding", function () {
  it("should return decoded value by URL", function () {
    let result = LisURLEncoder.decode(
      "https://www.google.com/search?q=lisandro+francesco&oq=lisandro+francesco&aqs=chrome..69i57j69i60l3j69i65.9413j0j1&sourceid=chrome&ie=UTF-8"
    );
    assert.deepEqual(result, {
      baseURL: "https://www.google.com/search",
      queryString: [
        { key: "q", value: "lisandro francesco" },
        { key: "oq", value: "lisandro francesco" },
        { key: "aqs", value: "chrome..69i57j69i60l3j69i65.9413j0j1" },
        { key: "sourceid", value: "chrome" },
        { key: "ie", value: "UTF-8" },
      ],
    });
  });
  it("should return null if URL is empty", function () {
    let result = LisURLEncoder.decode("");
    assert.deepEqual(result, null);
  });

  it("should return null if param is not an URL", function () {
    let result = LisURLEncoder.decode("test");
    assert.deepEqual(result, null);
  });
});
