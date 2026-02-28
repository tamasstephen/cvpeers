import { applySummaryListNormalizerStep } from './summary-list-normalizer.step';

describe('applySummaryListNormalizerStep', (): void => {
  const applyStepToHtml = (html: string): string => {
    const container = document.createElement('div');
    container.innerHTML = html;
    applySummaryListNormalizerStep(container);
    return container.innerHTML;
  };

  it('converts ordered list with bullet markers to unordered list semantics', (): void => {
    const result = applyStepToHtml('<ol><li data-list="bullet">One</li></ol>');

    expect(result).not.toContain('<ol');
    expect(result).toContain('<div');
    expect(result).toContain('•');
  });

  it('keeps regular ordered lists unchanged', (): void => {
    const result = applyStepToHtml('<ol><li>First</li><li>Second</li></ol>');

    expect(result).toContain('<ol');
    expect(result).not.toContain('•');
  });

  it('applies indent offset for nested bullet classes', (): void => {
    const result = applyStepToHtml('<ul><li class="ql-indent-2">Indented</li></ul>');

    expect(result).toContain('padding-left: 50px');
    expect(result).toContain('left: 36px');
  });
});
