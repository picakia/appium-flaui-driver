# Appium FlaUI Driver

*This project is heavily based on [appium-windows-driver](https://github.com/appium/appium-windows-driver) and the code is currently not thoroughly tested, please keep that in mind*

Appium FlaUI Driver is a test automation tool for Windows devices and acts as a proxy to [FlaUI.WebDriver server](https://github.com/FlaUI/FlaUI.WebDriver). Appium FlaUI Driver supports testing Universal Windows Platform (UWP), Windows Forms (WinForms), Windows Presentation Foundation (WPF), and Classic Windows (Win32) apps on Windows 10 PCs. The server itself is maintained by [aristotelos](https://github.com/aristotelos) and core Library is maintained by [Roemer](https://github.com/Roemer) at https://github.com/FlaUI/FlaUI. Check its [release notes](https://github.com/FlaUI/FlaUI.WebDriver/releases/) and the [documentation](https://github.com/FlaUI/FlaUI.WebDriver) to get more details on the supported features and possible pitfalls.

> **Note**
>
> This driver is only compatible with Appium 2.

## Usage

Beside of standard Appium requirements Appium FlaUI Driver adds the following prerequisites:

- Appium FlaUI Driver only supports Windows 10 as the host.
- [Developer mode](https://docs.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development) must be enabled
- Appium downloads FlaUI.WebDriver executable automatically upon executing its installation scripts, although, the actual binary version could be out of date. In such case you could download the most recent version of FlaUI.WebDriver manually from the [GitHub releases](https://github.com/FlaUI/FlaUI.WebDriver/releases) page.

Appium FlaUI Driver supports the following capabilities:

| Capability Name                    | Description                                                                                                                                                                                                                                                                                                                                          | Example Value                                                                      |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| platformName                       | Must be set to `windows` (case-insensitive).                                                                                                                                                                                                                                                                                                         | `windows`                                                                          |
| appium:automationName              | Must be set to `FlaUI` (case-insensitive).                                                                                                                                                                                                                                                                                                           | `FlaUI`                                                                            |
| appium:app                         | The path to the application, or in case of an UWP app, `<package family name>!App`. It is also possible to set app to `Root`. In such case the session will be invoked without any explicit target application. Either this capability, `appTopLevelWindow` or `appTopLevelWindowTitleMatch` must be provided on session startup.                    | `C:\Windows\System32\notepad.exe`, `Microsoft.WindowsCalculator_8wekyb3d8bbwe!App` |
| appium:appArguments                | Application arguments string, for example `/?`.                                                                                                                                                                                                                                                                                                      |                                                                                    |
| appium:appWorkingDir               | Full path to the folder, which is going to be set as the working dir for the application under test. This is only applicable for classic apps. When this is used the `appium:app` may contain a relative file path.                                                                                                                                  | `C:\MyApp\`                                                                        |
| appium:appTopLevelWindow           | The hexadecimal handle of an existing application top level window to attach to, for example `0x12345` (should be of string type). Either this capability, `appTopLevelWindowTitleMatch` or `app` must be provided on session startup.                                                                                                               | `0xC0B46`                                                                          |
| appium:appTopLevelWindowTitleMatch | The title of an existing application top level window to attach to, for example `My App Window Title` (should be of string type). Either this capability, `appTopLevelWindow` or `app` must be provided on session startup.                                                                                                                          | `My App Window Title` or `My App Window Title - .*`                                |
| appium:newCommandTimeout           | The number of seconds the to wait for clients to send commands before deciding that the client has gone away and the session should shut down. Default one minute (60).                                                                                                                                                                              | `120`                                                                              |
| appium:systemPort                  | The port number to execute Appium FlaUI Driver server listener on, for example `5556`. The port must not be occupied. The default starting port number for a new Appium FlaUI Driver session is `4724`. If this port is already busy then the next free port will be automatically selected.                                                         | `5556`                                                                             |
| appium:prerun                      | An object containing either `script` or `command` key. The value of each key must be a valid PowerShell script or command to be executed prior to the FlaUI.WebDriver session startup. See [Power Shell commands execution](#power-shell-commands-execution) for more details. Example: `{script: 'Get-Process outlook -ErrorAction SilentlyContinue'}` |
| appium:postrun                     | An object containing either `script` or `command` key. The value of each key must be a valid PowerShell script or command to be executed after FlaUI.WebDriver session is stopped. See [Power Shell commands execution](#power-shell-commands-execution) for more details.                                                                              |
| appium:newCommandTimeout           | How long (in seconds) the driver should wait for a new command from the client before assuming the client has stopped sending requests. After the timeout, the session is going to be deleted. `60` seconds by default. Setting it to zero disables the timer.                                                                                       |

## Example

TODO

## Power Shell commands execution

In the driver there is a possibility to run custom Power Shell scripts
from your client code. This feature is potentially insecure and thus needs to be
explicitly enabled when executing the server by providing `power_shell` key to the list
of enabled insecure features. Refer to [Appium Security document](https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/security.md) for more details.
It is possible to ether execute a single Power Shell command (use the `command` argument)
or a whole script (use the `script` argument) and get its
stdout in response. If the script execution returns non-zero exit code then an exception
is going to be thrown. The exception message will contain the actual stderr.
Here's an example code of how to control the Notepad process:

```java
// java
String psScript =
  "$sig = '[DllImport(\"user32.dll\")] public static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow);'\n" +
  "Add-Type -MemberDefinition $sig -name NativeMethods -namespace Win32\n" +
  "Start-Process Notepad\n" +
  "$hwnd = @(Get-Process Notepad)[0].MainWindowHandle\n" +
  "[Win32.NativeMethods]::ShowWindowAsync($hwnd, 2)\n" +
  "[Win32.NativeMethods]::ShowWindowAsync($hwnd, 4)\n" +
  "Stop-Process -Name Notepad";
driver.executeScript("powerShell", ImmutableMap.of("script", psScript));
```

Another example, which demonstrates how to use the command output:

```python
# python
cmd = 'Get-Process outlook -ErrorAction SilentlyContinue'
proc_info = driver.execute_script('powerShell', {'command': cmd})
if proc_info:
    print('Outlook is running')
else:
    print('Outlook is not running')
```

## Element Location

Appium FlaUI Driver supports the same location strategies [the FlaUI.WebDriver supports](https://github.com/FlaUI/FlaUI.WebDriver/blob/main/README.md#selectors):

| Selector                   | Locator strategy keyword | Supported?                                                                           |
| -------------------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| Automation ID              | `"accessibility id"`     | :white_check_mark:                                                                   |
| Name                       | `"name"`                 | :white_check_mark:                                                                   |
| Class name                 | `"class name"`           | :white_check_mark:                                                                   |
| Link text selector         | `"link text"`            | :white_check_mark:                                                                   |
| Partial link text selector | `"partial link text"`    | :white_check_mark:                                                                   |
| Tag name                   | `"tag name"`             | :white_check_mark:                                                                   |
| XPath selector             | `"xpath"`                | :white_check_mark:                                                                   |
| CSS selector               | `"css selector"`         | Only ID, class or `name` attribute selectors. IDs are interpreted as automation IDs. |

## Platform-Specific Extensions

Beside of standard W3C APIs the driver provides the below custom command extensions to execute platform specific scenarios. Use the following source code examples in order to invoke them from your client code:

```java
// Java 11+
var result = driver.executeScript("windows: <methodName>", Map.of(
    "arg1", "value1",
    "arg2", "value2"
    // you may add more pairs if needed or skip providing the map completely
    // if all arguments are defined as optional
));
```

```js
// WebdriverIO
const result = await driver.executeScript('windows: <methodName>', [
  {
    arg1: 'value1',
    arg2: 'value2',
  },
]);
```

```python
# Python
result = driver.execute_script('windows: <methodName>', {
    'arg1': 'value1',
    'arg2': 'value2',
})
```

```ruby
# Ruby
result = @driver.execute_script 'windows: <methodName>', {
    arg1: 'value1',
    arg2: 'value2',
}
```

```csharp
// Dotnet
object result = driver.ExecuteScript("windows: <methodName>", new Dictionary<string, object>() {
    {"arg1", "value1"},
    {"arg2", "value2"}
});
```

### windows: startRecordingScreen

Record the display in background while the automated test is running. This method requires [FFMPEG](https://www.ffmpeg.org/download.html) to be installed and present in PATH. The resulting video uses H264 codec and is ready to be played by media players built-in into web browsers.

#### Arguments

| Name          | Type    | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Example                                                                                                                                                               |
| ------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| videoFilter   | string  | no       | The video filter spec to apply for ffmpeg. See https://trac.ffmpeg.org/wiki/FilteringGuide for more details on the possible values.                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Set it to `scale=ifnot(gte(iw\,1024)\,iw\,1024):-2` in order to limit the video width to 1024px. The height will be adjusted automatically to match the actual ratio. |
| fps           | number  | no       | The count of frames per second in the resulting video. The greater fps it has the bigger file size is. The default vale is `15`                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 10                                                                                                                                                                    |
| preset        | string  | no       | One of the supported encoding presets. Possible values are: `ultrafast`, `superfast`, `veryfast` (the default value), `faster`, `fast`, `medium`, `slow`, `slower`, `veryslow`. A preset is a collection of options that will provide a certain encoding speed to compression ratio. A slower preset will provide better compression (compression is quality per filesize). This means that, for example, if you target a certain file size or constant bit rate, you will achieve better quality with a slower preset. Read https://trac.ffmpeg.org/wiki/Encode/H.264 for more details. | fast                                                                                                                                                                  |
| captureCursor | boolean | no       | Whether to capture the mouse cursor while recording the screen. `false` by default                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | true                                                                                                                                                                  |
| captureClicks | boolean | no       | Whether to capture mouse clicks while recording the screen. `false` by default                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | true                                                                                                                                                                  |
| timeLimit     | number  | no       | The maximum recording time, in seconds. The default value is 600 seconds (10 minutes)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 300                                                                                                                                                                   |
| forceRestart  | boolean | no       | Whether to ignore the call if a screen recording is currently running (`false`) or to start a new recording immediately and terminate the existing one if running (`true`, the default value).                                                                                                                                                                                                                                                                                                                                                                                           | true                                                                                                                                                                  |

### windows: stopRecordingScreen

Stop recording the screen. If no screen recording has been started before then the method returns an empty string.

#### Arguments

| Name          | Type                 | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                     | Example                                                                                      |
| ------------- | -------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| remotePath    | string               | no       | The path to the remote location, where the resulting video should be uploaded. The following protocols are supported: http/https, ftp. Null or empty string value (the default setting) means the content of resulting file should be encoded as Base64 and passed as the endpoint response value. An exception will be thrown if the generated media file is too big to fit into the available process memory. | https://myserver.com/upload/video.mp4                                                        |
| user          | string               | no       | The name of the user for the remote authentication.                                                                                                                                                                                                                                                                                                                                                             | myname                                                                                       |
| pass          | string               | no       | The password for the remote authentication.                                                                                                                                                                                                                                                                                                                                                                     | mypassword                                                                                   |
| method        | string               | no       | The http multipart upload method name. The 'PUT' one is used by default.                                                                                                                                                                                                                                                                                                                                        | POST                                                                                         |
| headers       | map                  | no       | Additional headers mapping for multipart http(s) uploads                                                                                                                                                                                                                                                                                                                                                        | `{"header": "value"}`                                                                        |
| fileFieldName | string               | no       | The name of the form field, where the file content BLOB should be stored for http(s) uploads. `file` by default                                                                                                                                                                                                                                                                                                 | payload                                                                                      |
| formFields    | Map or `Array<Pair>` | no       | Additional form fields for multipart http(s) uploads                                                                                                                                                                                                                                                                                                                                                            | `{"field1": "value1", "field2": "value2"}` or `[["field1", "value1"], ["field2", "value2"]]` |

#### Returns

Base64-encoded content of the recorded media file if `remotePath` parameter is falsy or an empty string.

### windows: deleteFile

Remove the file from the file system. This feature is potentially insecure and thus needs to be
explicitly enabled when executing the server by providing `modify_fs` key to the list
of enabled insecure features. Refer to [Appium Security document](https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/security.md) for more details.

#### Arguments

| Name       | Type   | Required | Description                                                                                                                                                                                                                                                                                                                           | Example                                                       |
| ---------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| remotePath | string | yes      | The path to a file. The path may contain environment variables that could be expanded on the server side. Due to security reasons only variables listed below would be expanded: `APPDATA`, `LOCALAPPDATA`, `PROGRAMFILES`, `PROGRAMFILES(X86)`, `PROGRAMDATA`, `ALLUSERSPROFILE`, `TEMP`, `TMP`, `HOMEPATH`, `USERPROFILE`, `PUBLIC` | `%HOMEPATH%\\SomeFile.txt` or `C:\\Users\\user\\SomeFile.txt` |

### windows: deleteFolder

Remove the folder from the file system. This feature is potentially insecure and thus needs to
be explicitly enabled when executing the server by providing `modify_fs` key to the list
of enabled insecure features. Refer to [Appium Security document](https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/security.md) for more details.

#### Arguments

| Name       | Type   | Required | Description                                                                                                                                                                                                                                                                                                                             | Example                                                       |
| ---------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| remotePath | string | yes      | The path to a folder. The path may contain environment variables that could be expanded on the server side. Due to security reasons only variables listed below would be expanded: `APPDATA`, `LOCALAPPDATA`, `PROGRAMFILES`, `PROGRAMFILES(X86)`, `PROGRAMDATA`, `ALLUSERSPROFILE`, `TEMP`, `TMP`, `HOMEPATH`, `USERPROFILE`, `PUBLIC` | `%HOMEPATH%\\SomeFolder\\` or `C:\\Users\\user\\SomeFolder\\` |

### windows: launchApp

(Re)launch app under test in the same session using the same capabilities configuration given
on the session startup.
Generally this API would create a new app window and point the current active session to it, but the actual result may vary depending on how the actual application under test handles multiple instances creation. Check
It is possible to switch between app windows using WebDriver [Windows API](https://www.selenium.dev/documentation/webdriver/interactions/windows/)

### windows: closeApp

It is possible to switch between opened app windows using WebDriver [Windows API](https://www.selenium.dev/documentation/webdriver/interactions/windows/).
After the current app window is closed it is required to use the above API to switch to another active window if there is any. `windows: closeApp` call does not perform the switch automatically.
An error is thrown if the app under test is not running.

### windows: click

This is a shortcut for a single mouse click gesture.

#### Arguments

| Name              | Type               | Required | Description                                                                                                                                                                                                                                     | Example                              |
| ----------------- | ------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| elementId         | string             | no       | Hexadecimal identifier of the element to click on. If this parameter is missing then given coordinates will be parsed as absolute ones. Otherwise they are parsed as relative to the top left corner of this element.                           | 123e4567-e89b-12d3-a456-426614174000 |
| x                 | number             | no       | Integer horizontal coordinate of the click point. Both x and y coordinates must be provided or none of them if elementId is present. In such case the gesture will be performed at the center point of the given element.                       | 100                                  |
| y                 | number             | no       | Integer vertical coordinate of the click point. Both x and y coordinates must be provided or none of them if elementId is present. In such case the gesture will be performed at the center point of the given element.                         | 100                                  |
| button            | string             | no       | Name of the mouse button to be clicked. An exception is thrown if an unknown button name is provided. Supported button names are: left, middle, right, back, forward. The default value is `left`                                               | right                                |
| modifierKeys      | string[] or string | no       | List of possible keys or a single key name to depress while the click is being performed. Supported key names are: Shift, Ctrl, Alt, Win. For example, in order to keep Ctrl+Alt depressed while clicking, provide the value of ['ctrl', 'alt'] | win                                  |
| durationMs        | number             | no       | The number of milliseconds to wait between pressing and releasing the mouse button. By default no delay is applied, which simulates a regular click.                                                                                            | 500                                  |
| times             | number             | no       | How many times the click must be performed. One by default.                                                                                                                                                                                     | 2                                    |
| interClickDelayMs | number             | no       | Duration of the pause between each click gesture. Only makes sense if `times` is greater than one. 100ms by default.                                                                                                                            | 10                                   |

### windows: scroll

This is a shortcut for a mouse wheel scroll gesture. The API is a thin wrapper over the [SendInput](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-sendinput#:~:text=The%20SendInput%20function%20inserts%20the,or%20other%20calls%20to%20SendInput.)
WinApi call. It emulates the mouse cursor movement and/or horizontal/vertical rotation of the mouse wheel.
Thus make sure the target control is ready to receive mouse wheel events (e.g. is focused) before invoking it.

#### Arguments

| Name         | Type               | Required | Description                                                                                                                                                                                                                                                                                     | Example                              |
| ------------ | ------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| elementId    | string             | no       | Same as in [windows: click](#windows-click)                                                                                                                                                                                                                                                     | 123e4567-e89b-12d3-a456-426614174000 |
| x            | number             | no       | Same as in [windows: click](#windows-click)                                                                                                                                                                                                                                                     | 100                                  |
| y            | number             | no       | Same as in [windows: click](#windows-click)                                                                                                                                                                                                                                                     | 100                                  |
| deltaX       | number             | no       | The amount of horizontal wheel movement measured in wheel clicks. A positive value indicates that the wheel was rotated to the right; a negative value indicates that the wheel was rotated to the left. Either this value or deltaY must be provided, but not both.                            | -5                                   |
| deltaY       | number             | no       | The amount of vertical wheel movement measured in wheel clicks. A positive value indicates that the wheel was rotated forward, away from the user; a negative value indicates that the wheel was rotated backward, toward the user. Either this value or deltaX must be provided, but not both. | 5                                    |
| modifierKeys | string[] or string | no       | Same as in [windows: click](#windows-click)                                                                                                                                                                                                                                                     | win                                  |

### windows: clickAndDrag

This is a shortcut for a drag and drop gesture.
| CSS selector               | `"css selector"`         | Only ID, class or `name` attribute selectors. IDs are interpreted as automation IDs. |
#### Arguments

| Name           | Type               | Required | Description                                                                                                                                  | Example                              |
| -------------- | ------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| startElementId | string             | no       | Same as in [windows: click](#windows-click)                                                                                                  | 123e4567-e89b-12d3-a456-426614174000 |
| startX         | number             | no       | Same as in [windows: click](#windows-click)                                                                                                  | 100                                  |
| startY         | number             | no       | Same as in [windows: click](#windows-click)                                                                                                  | 100                                  |
| endElementId   | string             | no       | Same as in [windows: click](#windows-click)                                                                                                  | 123e4567-e89b-12d3-a456-426614174000 |
| endX           | number             | no       | Same as in [windows: click](#windows-click)                                                                                                  | 100                                  |
| endY           | number             | no       | Same as in [windows: click](#windows-click)                                                                                                  | 100                                  |
| modifierKeys   | string[] or string | no       | Same as in [windows: click](#windows-click)                                                                                                  | win                                  |
| durationMs     | number             | no       | The number of milliseconds to wait between pressing the left mouse button and moving the cursor to the ending drag point. 5000ms by default. | 7000                                 |

### windows: hover

This is a shortcut for a hover gesture.

#### Arguments

| Name           | Type               | Required | Description                                                                                                         | Example                              |
| -------------- | ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| startElementId | string             | no       | Same as in [windows: click](#windows-click)                                                                         | 123e4567-e89b-12d3-a456-426614174000 |
| startX         | number             | no       | Same as in [windows: click](#windows-click)                                                                         | 100                                  |
| startY         | number             | no       | Same as in [windows: click](#windows-click)                                                                         | 100                                  |
| endElementId   | string             | no       | Same as in [windows: click](#windows-click)                                                                         | 123e4567-e89b-12d3-a456-426614174000 |
| endX           | number             | no       | Same as in [windows: click](#windows-click)                                                                         | 100                                  |
| endY           | number             | no       | Same as in [windows: click](#windows-click)                                                                         | 100                                  |
| modifierKeys   | string[] or string | no       | Same as in [windows: click](#windows-click)                                                                         | win                                  |
| durationMs     | number             | no       | The number of milliseconds between moving the cursor from the starting to the ending hover point. 500ms by default. | 700                                  |

### windows: keys

This is a shortcut for a customized keyboard input.

#### Arguments

| Name    | Type                     | Required | Description                                      | Example                                                                                                                |
| ------- | ------------------------ | -------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| actions | KeyAction[] or KeyAction | yes      | One or more [KeyAction](#keyaction) dictionaries | `json [{"virtualKeyCode": 0x10, "down": true}, {'text': "appium likes you"}, {"virtualKeyCode": 0x10, "down": false}]` |

##### KeyAction

| Name           | Type    | Required | Description                                                                                                                                                                                                                                                         | Example      |
| -------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| pause          | number  | no       | Allows to set a delay in milliseconds between key input series. Either this property or `text` or `virtualKeyCode` must be provided.                                                                                                                                | 100          |
| text           | string  | no       | Non-empty string of Unicode text to type (surrogate characters like smileys are not supported). Either this property or `pause` or `virtualKeyCode` must be provided.                                                                                               | Привіт Світ! |
| virtualKeyCode | number  | no       | Valid virtual key code. The list of supported key codes is available at [Virtual-Key Codes](https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes) page. Either this property or `pause` or `text` must be provided.                           | 0x10         |
| down           | boolean | no       | This property only makes sense in combination with `virtualKeyCode`. If set to `true` then the corresponding key will be depressed, `false` - released. By default the key is just pressed once. ! Do not forget to release depressed keys in your automated tests. | true         |

### windows: setClipboard

Sets Windows clipboard content to the given text or a PNG image.

#### Arguments

| Name        | Type                   | Required | Description                                                                                                                                                              | Example    |
| ----------- | ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| b64Content  | string                 | yes      | Base64-encoded content of the clipboard to be set                                                                                                                        | `QXBwaXVt` |
| contentType | 'plaintext' or 'image' | no       | Set to 'plaintext' in order to set the given text to the clipboard (the default value). Set to 'image' if `b64Content` contains a base64-encoded payload of a PNG image. | image      |

### windows: getClipboard

Retrieves Windows clipboard content.

#### Arguments

| Name        | Type                   | Required | Description                                                                                                                                                 | Example |
| ----------- | ---------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| contentType | 'plaintext' or 'image' | no       | Set to 'plaintext' in order to set the given text to the clipboard (the default value). Set to 'image' to retrieve a base64-encoded payload of a PNG image. | image   |

#### Returns

Base-64 encoded content of the Windows clipboard.

## Environment Variables

Appium FlaUI Driver supports the following environment variables:

| Variable Name     | Description                                                                                                                                                                                                                                                                                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| APPIUM_FLAUI_PATH | A full path to `FlaUI.WebDriver.exe`. If you need to provide a custom path to FlaUI.WebDriver executable then set the corresponding env variable value via CMD or PowerShell: `setx APPIUM_FLAUI_PATH "D:\New Folder\FlaUI.WebDriver.exe"`. The default location of the executable is assumed to be `${process.cwd()}\FlaUI-Webdriver\FlaUI.WebDriver.exe`. |

## Development

```bash
# Checkout the current repository and run
npm install
```

## Test

You can run unit and e2e tests locally:

```bash
# unit tests
npm run unit-test

# e2e tests
npm run e2e-test
```
