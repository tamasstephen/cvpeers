import { applySummaryTypographyStep } from './summary-typography.step';

describe('applySummaryTypographyStep', (): void => {
  const applyStepToHtml = (html: string): string => {
    const container = document.createElement('div');
    container.innerHTML = html;
    applySummaryTypographyStep(container);
    return container.innerHTML;
  };

  it('replaces strong tags with semibold styled span tags', (): void => {
    const result = applyStepToHtml('<p><strong>Bold text</strong></p>');

    expect(result).not.toContain('<strong>');
    expect(result).toContain('font-family: \'Geist-SemiBold\'');
    expect(result).toContain('font-weight: bold');
    expect(result).toContain('<span');
  });

  it('preserves existing inline styles from strong tags', (): void => {
    const result = applyStepToHtml('<p><strong style="letter-spacing: 0.1px;">Styled</strong></p>');

    expect(result).toContain('letter-spacing: 0.1px;');
    expect(result).toContain('font-family: \'Geist-SemiBold\'');
  });

  it('leaves content unchanged when no strong tags exist', (): void => {
    const result = applyStepToHtml('<p>Regular text</p>');

    expect(result).toContain('<p>Regular text</p>');
  });
});
