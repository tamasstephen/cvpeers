import { Injectable } from '@angular/core';

const CV_FORM_STORAGE_KEY = 'cv_form_data';

@Injectable({ providedIn: 'root' })
export class CvFormStorageAdapter {
  public save(serializedFormData: string): void {
    localStorage.setItem(CV_FORM_STORAGE_KEY, serializedFormData);
  }

  public load(): string | null {
    return localStorage.getItem(CV_FORM_STORAGE_KEY);
  }

  public clear(): void {
    localStorage.removeItem(CV_FORM_STORAGE_KEY);
  }
}
