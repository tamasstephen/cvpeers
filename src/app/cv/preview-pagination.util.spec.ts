import { computeKeepTogetherSpacers, resolveSemanticPageSlices } from './preview-pagination.util';

describe('computeKeepTogetherSpacers', (): void => {
  it('should return no spacers when blocks fit in page bounds', (): void => {
    const spacers = computeKeepTogetherSpacers(100, [
      { top: 0, height: 20 },
      { top: 30, height: 30 },
      { top: 120, height: 20 },
    ]);

    expect(spacers).toEqual([0, 0, 0]);
  });

  it('should push a crossing block to the next page', (): void => {
    const spacers = computeKeepTogetherSpacers(100, [{ top: 70, height: 40 }]);

    expect(spacers).toEqual([30]);
  });

  it('should cascade spacing into later block calculations', (): void => {
    const spacers = computeKeepTogetherSpacers(100, [
      { top: 70, height: 40 },
      { top: 120, height: 30 },
    ]);

    expect(spacers).toEqual([30, 0]);
  });

  it('should skip blocks that are taller than a page', (): void => {
    const spacers = computeKeepTogetherSpacers(100, [{ top: 60, height: 150 }]);

    expect(spacers).toEqual([0]);
  });
});

describe('resolveSemanticPageSlices', (): void => {
  it('Fixture A: should keep short content on one page', (): void => {
    const slices = resolveSemanticPageSlices({
      pageHeight: 100,
      totalHeight: 82,
      blocks: [
        { top: 6, height: 18 },
        { top: 30, height: 16 },
        { top: 54, height: 18 },
      ],
    });

    expect(slices).toEqual([{ offset: 0, height: 82 }]);
  });

  it('Fixture B: should break before overflowing boundary blocks with no overlap', (): void => {
    const slices = resolveSemanticPageSlices({
      pageHeight: 100,
      totalHeight: 220,
      blocks: [
        { top: 8, height: 20 },
        { top: 34, height: 18 },
        { top: 62, height: 24 },
        { top: 88, height: 24 },
        { top: 130, height: 30 },
        { top: 170, height: 40 },
      ],
    });

    expect(slices).toEqual([
      { offset: 0, height: 88 },
      { offset: 88, height: 82 },
      { offset: 170, height: 50 },
    ]);
    expect(slices[1].offset).toBe(slices[0].offset + slices[0].height);
    expect(slices[2].offset).toBe(slices[1].offset + slices[1].height);
  });

  it('Fixture C: should produce deterministic 2+ page slices for dense long content', (): void => {
    const slices = resolveSemanticPageSlices({
      pageHeight: 100,
      totalHeight: 410,
      blocks: [
        { top: 10, height: 16 },
        { top: 32, height: 16 },
        { top: 54, height: 16 },
        { top: 76, height: 16 },
        { top: 98, height: 16 },
        { top: 120, height: 16 },
        { top: 142, height: 16 },
        { top: 164, height: 16 },
        { top: 186, height: 16 },
        { top: 208, height: 16 },
        { top: 230, height: 16 },
        { top: 252, height: 16 },
        { top: 274, height: 16 },
        { top: 296, height: 16 },
        { top: 318, height: 16 },
        { top: 340, height: 16 },
        { top: 362, height: 16 },
      ],
    });

    expect(slices).toEqual([
      { offset: 0, height: 98 },
      { offset: 98, height: 88 },
      { offset: 186, height: 88 },
      { offset: 274, height: 88 },
      { offset: 362, height: 48 },
    ]);
  });

  it('should hard-cut when a single block is taller than one page', (): void => {
    const slices = resolveSemanticPageSlices({
      pageHeight: 100,
      totalHeight: 260,
      blocks: [
        { top: 100, height: 130 },
        { top: 240, height: 12 },
      ],
    });

    expect(slices).toEqual([
      { offset: 0, height: 100 },
      { offset: 100, height: 100 },
      { offset: 200, height: 60 },
    ]);
  });
});
