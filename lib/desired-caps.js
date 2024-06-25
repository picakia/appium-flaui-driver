const desiredCapConstraints = {
  // https://github.com/FlaUI/FlaUI.WebDriver/blob/main/README.md#capabilities
  platformName: {
    presence: true,
    isString: true,
    inclusionCaseInsensitive: ['Windows'],
  },
  browserName: {
    isString: true,
  },
  platformVersion: {
    isString: true,
  },
  app: {
    isString: true,
  },
  appArguments: {
    isString: true,
  },
  appTopLevelWindow: {
    isString: true,
  },
  appWorkingDir: {
    isString: true,
  },
  appTopLevelWindowTitleMatch: {
    isString: true,
  },
  newCommandTimeout: {
    isNumber: true,
  },

  /*createSessionTimeout: {
    isNumber: true
  },
  'ms:waitForAppLaunch': {
    isNumber: true // in seconds
  },
  'ms:experimental-webdriver': {
    isBoolean: true
  },
  systemPort: {
    isNumber: true
  },
  prerun: {
    isObject: true
  },
  postrun: {
    isObject: true
  }*/
};

export {desiredCapConstraints};
export default desiredCapConstraints;
