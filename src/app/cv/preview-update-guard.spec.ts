import { createPreviewUpdateGuard } from './preview-update-guard';

describe('preview update guard', (): void => {
  it('marks the latest issued token as current', (): void => {
    const guard = createPreviewUpdateGuard();

    const firstToken = guard.nextToken();
    const secondToken = guard.nextToken();

    expect(guard.isCurrent(secondToken)).toBeTrue();
    expect(guard.isCurrent(firstToken)).toBeFalse();
  });

  it('keeps single issued token current until a newer one is requested', (): void => {
    const guard = createPreviewUpdateGuard();
    const token = guard.nextToken();

    expect(guard.isCurrent(token)).toBeTrue();
  });
});
