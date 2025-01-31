import ImageTag from './image-tag';

describe('ImageTag', () => {
  const testImageParameters = {
    editorVersion: '2099.9.f9f9',
    targetPlatform: 'Test',
    builderPlatform: '',
  };

  const defaults = {
    repository: 'unityci',
    name: 'editor',
    image: 'unityci/editor',
  };

  describe('constructor', () => {
    it('can be called', () => {
      expect(() => new ImageTag(testImageParameters)).not.toThrow();
    });

    it('accepts parameters and sets the right properties', () => {
      const image = new ImageTag(testImageParameters);

      expect(image.repository).toStrictEqual('unityci');
      expect(image.name).toStrictEqual('editor');
      expect(image.editorVersion).toStrictEqual(testImageParameters.editorVersion);
      expect(image.targetPlatform).toStrictEqual(testImageParameters.targetPlatform);
      expect(image.builderPlatform).toStrictEqual(testImageParameters.builderPlatform);
    });

    test.each(['2000.0.0f0', '2011.1.11f1'])('accepts %p version format', (version) => {
      expect(
        () => new ImageTag({ editorVersion: version, targetPlatform: testImageParameters.targetPlatform }),
      ).not.toThrow();
    });

    test.each(['some version', ''])('throws for incorrect version %p', (editorVersion) => {
      const { targetPlatform } = testImageParameters;
      expect(() => new ImageTag({ editorVersion, targetPlatform })).toThrow();
    });

    test.each(['nonExisting'])('throws for unsupported target %p', (targetPlatform) => {
      expect(() => new ImageTag({ targetPlatform })).toThrow();
    });
  });

  describe('toString', () => {
    it('returns the correct version', () => {
      const image = new ImageTag({ editorVersion: '2099.1.1111', targetPlatform: testImageParameters.targetPlatform });
      switch (process.platform) {
        case 'win32':
          expect(image.toString()).toStrictEqual(`${defaults.image}:windows-2099.1.1111-2`);
          break;
        case 'linux':
          expect(image.toString()).toStrictEqual(`${defaults.image}:ubuntu-2099.1.1111-2`);
          break;
      }
    });
    it('returns customImage if given', () => {
      const image = new ImageTag({
        editorVersion: '2099.1.1111',
        targetPlatform: testImageParameters.targetPlatform,
        customImage: `${defaults.image}:2099.1.1111@347598437689743986`,
      });

      expect(image.toString()).toStrictEqual(image.customImage);
    });

    it('returns the specific build platform', () => {
      const image = new ImageTag({ editorVersion: '2019.2.11f1', targetPlatform: 'WebGL' });

      switch (process.platform) {
        case 'win32':
          expect(image.toString()).toStrictEqual(`${defaults.image}:windows-2019.2.11f1-webgl-2`);
          break;
        case 'linux':
          expect(image.toString()).toStrictEqual(`${defaults.image}:ubuntu-2019.2.11f1-webgl-2`);
          break;
      }
    });

    it('returns no specific build platform for generic targetPlatforms', () => {
      const image = new ImageTag({ editorVersion: '2019.2.11f1', targetPlatform: 'NoTarget' });

      switch (process.platform) {
        case 'win32':
          expect(image.toString()).toStrictEqual(`${defaults.image}:windows-2019.2.11f1-2`);
          break;
        case 'linux':
          expect(image.toString()).toStrictEqual(`${defaults.image}:ubuntu-2019.2.11f1-2`);
          break;
      }
    });
  });
});
