import { getPageContentHeightPx, resolvePageContentHeightFromWidthPx } from './preview-measurement.unit';

describe('preview measurement unit', (): void => {
  it('computes page content height from a measured content width ratio', (): void => {
    const heightPx = resolvePageContentHeightFromWidthPx({
      contentWidthPx: 760,
      pageContentWidthMm: 190,
      pageContentHeightMm: 277,
    });

    expect(heightPx).toBeCloseTo(1108, 0);
  });

  it('prefers provided content width over probe measurement', (): void => {
    const container = document.createElement('div');
    const heightPx = getPageContentHeightPx({
      container,
      pageContentWidthMm: 190,
      pageContentHeightMm: 277,
      contentWidthPx: 760,
    });

    expect(heightPx).toBeCloseTo(1108, 0);
  });
});
