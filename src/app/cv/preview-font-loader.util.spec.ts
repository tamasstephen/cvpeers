import { ensurePreviewFontsReady } from './preview-font-loader.util';

interface FontSetLike {
  ready: Promise<void>;
  load: jasmine.Spy<(font: string) => Promise<unknown>>;
}

describe('preview font loader util', (): void => {
  it('waits for font readiness and loads required preview font faces', async (): Promise<void> => {
    const fonts: FontSetLike = {
      ready: Promise.resolve(),
      load: jasmine.createSpy('load').and.resolveTo([]),
    };

    await ensurePreviewFontsReady(fonts);

    expect(fonts.load).toHaveBeenCalledTimes(3);
    expect(fonts.load).toHaveBeenCalledWith("normal 12px 'Geist'");
    expect(fonts.load).toHaveBeenCalledWith("600 14px 'Geist-SemiBold'");
    expect(fonts.load).toHaveBeenCalledWith("700 14px 'GeistMono-SemiBold'");
  });
});
