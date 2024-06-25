import { remote as wdio } from 'webdriverio';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { isAdmin } from '../../lib/installer';
import { TEST_HOST, TEST_PORT } from './constants';

chai.should();
chai.use(chaiAsPromised);


const TEST_CAPS = {
  platformName: 'Windows',
  'appium:automationName': 'flaui',
  'appium:app': 'Microsoft.WindowsCalculator_8wekyb3d8bbwe!App',
};

const WDIO_OPTS = {
  hostname: TEST_HOST,
  port: TEST_PORT,
  connectionRetryCount: 0,
  capabilities: TEST_CAPS
};

describe('Driver', function () {
  let driver;

  beforeEach(async function () {
    if (process.env.CI || !await isAdmin()) {
      return this.skip();
    }

    driver = await wdio(WDIO_OPTS);
  });

  afterEach(async function () {
    try {
      if (driver) {
        await driver.deleteSession();
      }
    } finally {
      driver = null;
    }
  });

  it('should run a basic session using a real client', async function () {
    await driver.source().should.eventually.be.not.empty;
  });
});
