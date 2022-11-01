const Device = {
  isMobile(){
    const mobile = !!window.navigator.userAgent.match(/mobile|ip(hone|ad|od)/gi),
    htmlElement = document.documentElement;
    htmlElement.classList[mobile ? "add" : "remove"]("is-mobile");
    return mobile;
  }
};

export default Device;