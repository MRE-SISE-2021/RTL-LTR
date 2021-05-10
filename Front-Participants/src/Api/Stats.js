import axios from "../axios";

function getOperatingSystem(window) {
  let operatingSystem = "Not known";
  if (window.navigator.appVersion.indexOf("Win") !== -1) {
    operatingSystem = "Windows OS";
  }
  if (window.navigator.appVersion.indexOf("Mac") !== -1) {
    operatingSystem = "MacOS";
  }
  if (window.navigator.appVersion.indexOf("X11") !== -1) {
    operatingSystem = "UNIX OS";
  }
  if (window.navigator.appVersion.indexOf("Linux") !== -1) {
    operatingSystem = "Linux OS";
  }

  return operatingSystem;
}

function getBrowser(window) {
  let currentBrowser = "Not known";
  if (window.navigator.userAgent.indexOf("Chrome") !== -1) {
    currentBrowser = "Google Chrome";
  } else if (window.navigator.userAgent.indexOf("Firefox") !== -1) {
    currentBrowser = "Mozilla Firefox";
  } else if (window.navigator.userAgent.indexOf("MSIE") !== -1) {
    currentBrowser = "Internet Exployer";
  } else if (window.navigator.userAgent.indexOf("Edge") !== -1) {
    currentBrowser = "Edge";
  } else if (window.navigator.userAgent.indexOf("Safari") !== -1) {
    currentBrowser = "Safari";
  } else if (window.navigator.userAgent.indexOf("Opera") !== -1) {
    currentBrowser = "Opera";
  } else if (window.navigator.userAgent.indexOf("Opera") !== -1) {
    currentBrowser = "YaBrowser";
  } else {
    console.log("Others");
  }

  return currentBrowser;
}

/// --- get country name and city ------
async function getGeoInfo() {
  const response = axios
    .get("https://ipapi.co/json/")
    .then((response) => {
      let data = response.data;
      return data;
    })
    .catch((error) => {
      console.log(error);
    });

  return response; // parses JSON response into native JavaScript objects
}

////////////////////////////////////////////////////////////////////////////
class Stats {
  getBrowser(window) {
    return getBrowser(window);
  }

  getOperatingSystem(window) {
    return getOperatingSystem(window);
  }

  getGeoInfo() {
    return getGeoInfo();
  }
}
export default new Stats();
