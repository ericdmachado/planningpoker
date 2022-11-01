import Chroma from "chroma-js";

const Color = {
  lightOrDark(color) {
    const _color = Chroma.contrast('#FFF', color);
    return parseFloat(_color) > 2.5;
  },
};

export default Color;
