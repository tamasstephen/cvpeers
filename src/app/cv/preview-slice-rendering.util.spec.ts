import {
  normalizePreviewSlicesForRendering,
  resolvePreviewSliceOffsetPx,
  resolvePreviewViewportHeightPx,
} from './preview-slice-rendering.util';

describe('preview slice rendering util', (): void => {
  it('keeps first-page viewport height unchanged', (): void => {
    const height = resolvePreviewViewportHeightPx({
      sliceHeightPx: 86,
      isFirstPage: true,
      isLastPage: false,
    });

    expect(height).toBe(86);
  });

  it('keeps middle-page viewport height unchanged', (): void => {
    const height = resolvePreviewViewportHeightPx({
      sliceHeightPx: 86,
      isFirstPage: false,
      isLastPage: false,
    });

    expect(height).toBe(86);
  });

  it('keeps last-page viewport height unchanged', (): void => {
    const height = resolvePreviewViewportHeightPx({
      sliceHeightPx: 86,
      isFirstPage: true,
      isLastPage: true,
    });

    expect(height).toBe(86);
  });

  it('keeps non-first last-page viewport height unchanged', (): void => {
    const height = resolvePreviewViewportHeightPx({
      sliceHeightPx: 86,
      isFirstPage: false,
      isLastPage: true,
    });

    expect(height).toBe(86);
  });

  it('keeps non-first page offset unchanged', (): void => {
    const offset = resolvePreviewSliceOffsetPx({
      sliceOffsetPx: 87,
      isFirstPage: false,
    });

    expect(offset).toBe(87);
  });

  it('does not shift first page offset', (): void => {
    const offset = resolvePreviewSliceOffsetPx({
      sliceOffsetPx: 0,
      isFirstPage: true,
    });

    expect(offset).toBe(0);
  });

  it('normalizes slice offsets and heights to contiguous integer boundaries', (): void => {
    const normalizedSlices = normalizePreviewSlicesForRendering({
      slices: [
        { offset: 0, height: 86.8 },
        { offset: 86.8, height: 53.1 },
      ],
      totalHeightPx: 139.9,
    });

    expect(normalizedSlices).toEqual([
      { offset: 0, height: 87 },
      { offset: 87, height: 53 },
    ]);
  });
});
