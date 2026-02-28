import { transformSummaryHtml } from './summary-transform.pipeline';

describe('transformSummaryHtml', (): void => {
  it('applies sanitizer, list normalization and typography transformations', (): void => {
    const input =
      '<p style="background: red;"><strong>Bold</strong><span class="ql-ui"></span></p><ol><li data-list="bullet">Item</li></ol>';

    const output = transformSummaryHtml(input);

    expect(output).not.toContain('class="ql-ui"');
    expect(output).not.toContain('<strong>');
    expect(output).toContain("font-family: 'Geist-SemiBold'");
    expect(output).toContain('•');
    expect(output).toContain('color: #323232;');
  });

  it('returns empty input as is', (): void => {
    expect(transformSummaryHtml('')).toBe('');
  });
});
