import { InjectionToken } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type Social = 'github' | 'linkedin';
export type SocialOption = {
  label: string;
  value: Social;
  src: string;
};

export type SocialItem = {
  url: string;
  type: Social;
  src: string;
};

export const SOCIAL_OPTIONS: SocialOption[] = [
  { label: 'Github', value: 'github', src: 'assets/images/github-fill.png' },
  {
    label: 'LinkedIn',
    value: 'linkedin',
    src: 'assets/images/linkedin-box-fill.png',
  },
];

export const SOCIAL_OPTIONS_TOKEN = new InjectionToken<SocialOption[]>('SOCIAL_OPTIONS');

export const SOCIAL_OPTIONS_PROVIDER = {
  provide: SOCIAL_OPTIONS_TOKEN,
  useValue: SOCIAL_OPTIONS,
};

export type SocialForm = FormGroup<{
  social: FormArray<FormControl<SocialItem>>;
}>;

export type SocialFormValues = SocialItem[];
