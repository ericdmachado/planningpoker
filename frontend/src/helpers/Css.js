const HTML = ()=>document.documentElement;

const Css = {
  getVariable(value) {
    return getComputedStyle(HTML()).getPropertyValue(value);
  },
  setVariable(key, value) {
    HTML().style.setProperty(key, value);
  },
  setMetaThemeColor(value) {
    HTML().querySelector('meta[name="msapplication-TileColor"]').content = value;
    HTML().querySelector('meta[name="theme-color"]').content = value;
  }
};

export default Css;