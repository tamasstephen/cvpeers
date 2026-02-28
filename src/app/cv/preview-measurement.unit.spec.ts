import {
  getPageContentHeightPx,
  measureSemanticBlocks,
  mmToPx,
} from './preview-measurement.unit';

describe('preview measurement unit', (): void => {
  it('converts mm to px with 96dpi ratio', (): void => {
    expect(mmToPx(25.4)).toBe(96);
    expect(mmToPx(0)).toBe(0);
  });

  it('uses measured probe height when available', (): void => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    spyOn(HTMLElement.prototype, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 0, 0, 500));

    const result = getPageContentHeightPx({
      container,
      pageContentWidthMm: 190,
      pageContentHeightMm: 277,
    });

    expect(result).toBe(500);
    document.body.removeChild(container);
  });

  it('filters, sorts and deduplicates semantic blocks', (): void => {
    const root = document.createElement('div');
    const first = document.createElement('section');
    const duplicate = document.createElement('section');
    const small = document.createElement('section');
    const second = document.createElement('section');

    first.className = 'keep';
    duplicate.className = 'keep';
    small.className = 'keep';
    second.className = 'keep';

    root.appendChild(first);
    root.appendChild(duplicate);
    root.appendChild(small);
    root.appendChild(second);

    spyOn(root, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 100, 100, 300));
    spyOn(first, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 120, 100, 20));
    spyOn(duplicate, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 120, 100, 20));
    spyOn(small, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 160, 100, 6));
    spyOn(second, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 190, 100, 18));

    const blocks = measureSemanticBlocks({
      previewSource: root,
      selector: '.keep',
      pageHeightPx: 100,
    });

    expect(blocks).toEqual([
      { top: 20, height: 20 },
      { top: 90, height: 18 },
    ]);
  });
});
