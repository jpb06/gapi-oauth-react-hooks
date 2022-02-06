import { mocked } from 'jest-mock';
import { JSDOM } from 'jsdom';

import { delay } from '../tests-related/util/delay.util';
import { loadScript, removeScript } from './resource.loading.logic';

describe('loadScript function', () => {
  const handleScriptLoaded = jest.fn();
  const handleScriptLoadError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load the script and call the callback function', async () => {
    const dom = await JSDOM.fromFile(
      './src/tests-related/mocks/documents/mock.document.html',
      {
        resources: 'usable',
        runScripts: 'dangerously',
      },
    );
    const document = dom.window.document;

    document.addEventListener('load', () => {
      expect(mocked(handleScriptLoaded)).toHaveBeenCalledTimes(1);

      const scripts = document.getElementsByTagName('script');
      expect(scripts).toHaveLength(2);
      expect(
        scripts.namedItem('mock-script')?.src.endsWith('/mock-script.js'),
      ).toBeTruthy();
    });

    loadScript(
      document,
      'mock-script',
      './mock-script.js',
      handleScriptLoaded,
      handleScriptLoadError,
    );
    await delay(100);
  });

  it('should load the script even if there is no script tags in the dom', async () => {
    const dom = await JSDOM.fromFile(
      './src/tests-related/mocks/documents/mock.document.without.script.html',
      {
        resources: 'usable',
        runScripts: 'dangerously',
      },
    );
    const document = dom.window.document;

    document.addEventListener('load', () => {
      expect(mocked(handleScriptLoaded)).toHaveBeenCalledTimes(1);

      const scripts = document.getElementsByTagName('script');
      expect(scripts).toHaveLength(1);
      expect(
        scripts.namedItem('mock-script')?.src.endsWith('/mock-script.js'),
      ).toBeTruthy();
    });

    loadScript(
      document,
      'mock-script',
      './mock-script.js',
      handleScriptLoaded,
      handleScriptLoadError,
    );
    await delay(100);
  });
});

describe('removeScript function', () => {
  it('should remove the script', async () => {
    const dom = await JSDOM.fromFile(
      './src/tests-related/mocks/documents/mock.document.html',
      {
        resources: 'usable',
        runScripts: 'dangerously',
      },
    );
    const document = dom.window.document;

    removeScript(document, 'yolo-script');

    const scripts = document.getElementsByTagName('script');
    expect(scripts).toHaveLength(0);
  });

  it('should not do anything if id does not exist', async () => {
    const dom = await JSDOM.fromFile(
      './src/tests-related/mocks/documents/mock.document.html',
      {
        resources: 'usable',
        runScripts: 'dangerously',
      },
    );
    const document = dom.window.document;

    removeScript(document, 'no-script');

    const scripts = document.getElementsByTagName('script');
    expect(scripts).toHaveLength(1);
    expect(document.getElementById('yolo-script')).not.toBeNull();
  });
});
