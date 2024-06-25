const commands = {};

// https://github.com/microsoft/WinAppDriver/blob/master/Docs/SupportedAPIs.md

/**
 * (Re)launch app under test in the same session using the same capabilities configuration.
 * Generally this API would create a new app window and point the current active session to it,
 * but the actual result may vary depending on how the actual application under test handles multiple
 * instances creation. Check
 * https://github.com/microsoft/WinAppDriver/blob/master/Tests/WebDriverAPI/AppiumAppLaunch.cs
 * for more examples.
 * It is possible to open another window of the same app and then switch between
 * windows using https://www.selenium.dev/documentation/webdriver/interactions/windows/ API
 */
commands.windowsLaunchApp = async function windowsLaunchApp (/* opts = {} */) {
  return await this.flaUiWebDriver.sendCommand('/appium/app/launch', 'POST', {});
};

/**
 * Close the active window of the app under test. Check
 * https://github.com/microsoft/WinAppDriver/blob/master/Tests/WebDriverAPI/AppiumAppClose.cs
 * for more examples.
 * It is possible to switch between opened app
 * windows using https://www.selenium.dev/documentation/webdriver/interactions/windows/ API.
 * After the current app window is closed it is required to use the above API to switch to another
 * active window if there is any; this API does not perform the switch automatically.
 *
 * @throws {Error} if the app process is not running
 */
commands.windowsCloseApp = async function windowsCloseApp (/* opts = {} */) {
  return await this.flaUiWebDriver.sendCommand('/appium/app/close', 'POST', {});
};

export { commands };
export default commands;
