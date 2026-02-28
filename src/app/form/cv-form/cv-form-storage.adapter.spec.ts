import { CvFormStorageAdapter } from './cv-form-storage.adapter';

describe('CvFormStorageAdapter', (): void => {
  let adapter: CvFormStorageAdapter;

  beforeEach((): void => {
    localStorage.clear();
    adapter = new CvFormStorageAdapter();
  });

  it('stores serialized form data under the cv form key', (): void => {
    const payload = '{"foo":"bar"}';

    adapter.save(payload);

    expect(localStorage.getItem('cv_form_data')).toBe(payload);
  });

  it('returns stored data when present', (): void => {
    const payload = '{"summary":"<p>Stored summary</p>"}';
    localStorage.setItem('cv_form_data', payload);

    const loadedData = adapter.load();

    expect(loadedData).toBe(payload);
  });

  it('returns null when no data is present', (): void => {
    const loadedData = adapter.load();

    expect(loadedData).toBeNull();
  });

  it('clears persisted data', (): void => {
    localStorage.setItem('cv_form_data', '{"foo":"bar"}');

    adapter.clear();

    expect(localStorage.getItem('cv_form_data')).toBeNull();
  });
});
