import _ from 'lodash';
import {system, fs, net} from 'appium/support';
import {exec} from 'teen_process';
import log from './logger';

// https://github.com/FlaUI/FlaUI.WebDriver/releases
const WAD_VER = '0.2.1';
const WAD_DOWNLOAD_MD5 = Object.freeze({
  x64: 'cbc42301987c67e95fb24cdb43cf461f',
});
//https://github.com/FlaUI/FlaUI.WebDriver/releases/download/v0.2.1/FlaUI.WebDriver.exe
const ARCH_MAPPING = Object.freeze({x32: 'x86', x64: 'x64'});
const WAD_DOWNLOAD_TIMEOUT_MS = 60000;
const FLAUI_INSTALL_PATH = `${process.cwd()}/FlaUI-Webdriver`;
const FLAUI_EXE_NAME = 'FlaUI.WebDriver.exe';

function generateWadDownloadLink() {
  const wadArch = ARCH_MAPPING[process.arch];
  if (!wadArch) {
    throw new Error(
      `System architecture '${process.arch}' is not supported by FlaUI.WebDriver. ` +
        `The only supported architectures are: ${_.keys(ARCH_MAPPING)}`
    );
  }
  return (
    `https://github.com/FlaUI/FlaUI.WebDriver` + `/releases/download/v${WAD_VER}/${FLAUI_EXE_NAME}`
  );
}

class WADNotFoundError extends Error {}

const getWADExecutablePath = _.memoize(async function getWADInstallPath() {
  const wadPath = process.env.APPIUM_FLAUI_PATH ?? '';
  if (await fs.exists(wadPath)) {
    log.debug(
      `Loaded FlaUI.WebDriver path from the APPIUM_FLAUI_PATH environment variable: ${wadPath}`
    );
    return wadPath;
  }

  if (await fs.exists(FLAUI_INSTALL_PATH)) {
    return `${FLAUI_INSTALL_PATH}/${FLAUI_EXE_NAME}`;
  }

  log.debug('Did not detect WAD executable at any of the default install locations');
  throw new WADNotFoundError(
    `${FLAUI_EXE_NAME} has not been found in any of these ` +
      `locations: ${FLAUI_INSTALL_PATH} | ${wadPath}. Is it installed?`
  );
});

async function downloadWAD() {
  const downloadLink = generateWadDownloadLink();
  const driverPath = `${FLAUI_INSTALL_PATH}/${FLAUI_EXE_NAME}`;
  log.info(`Downloading ${downloadLink} to '${FLAUI_INSTALL_PATH}'`);
  await fs.mkdir(FLAUI_INSTALL_PATH);
  await net.downloadFile(downloadLink, driverPath, {timeout: WAD_DOWNLOAD_TIMEOUT_MS});
  const downloadedMd5 = await fs.md5(driverPath);
  const expectedMd5 = WAD_DOWNLOAD_MD5[process.arch];
  if (downloadedMd5 !== expectedMd5) {
    await fs.rimraf(driverPath);
    throw new Error(
      `FlaUI.WebDriver executable checksum validation error: expected ${expectedMd5} but got ${downloadedMd5}`
    );
  }
  return driverPath;
}

const isAdmin = async function isAdmin() {
  try {
    await exec('fsutil.exe', ['dirty', 'query', process.env.SystemDrive || 'C:']);
    return true;
  } catch (ign) {
    return false;
  }
};

async function setupWAD() {
  if (!system.isWindows()) {
    throw new Error(`Can only download FlaUI.WebDriver on Windows!`);
  }

  try {
    return await getWADExecutablePath();
  } catch (e) {
    if (!(e instanceof WADNotFoundError)) {
      throw e;
    }
    log.info(`FlaUI.WebDriver doesn't exist, setting up`);
  }

  const downloadPath = await downloadWAD();
  log.info(`Running FlaUI.WebDriver v${WAD_VER} download`);
  await fs.rimraf(downloadPath);
}

export {downloadWAD, setupWAD, getWADExecutablePath, isAdmin};
export default setupWAD;
