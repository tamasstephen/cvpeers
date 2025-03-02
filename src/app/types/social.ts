import { InjectionToken } from '@angular/core';

export type Social = 'github' | 'linkedin';
export type SocialOption = {
  label: string;
  value: Social;
};

export type SocialItem = {
  url: string;
  type: Social;
};

export const SOCIAL_OPTIONS: SocialOption[] = [
  { label: 'Github', value: 'github' },
  { label: 'LinkedIn', value: 'linkedin' },
];

export const SOCIAL_OPTIONS_TOKEN = new InjectionToken<SocialOption[]>(
  'SOCIAL_OPTIONS'
);

export const SOCIAL_OPTIONS_PROVIDER = {
  provide: SOCIAL_OPTIONS_TOKEN,
  useValue: SOCIAL_OPTIONS,
};
