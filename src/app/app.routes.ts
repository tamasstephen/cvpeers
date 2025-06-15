import { Routes } from '@angular/router';
import { CvFormComponent } from './form/cv-form/cv-form.component';
import { LandingComponent } from './landing/landing.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'cv',
    component: CvFormComponent,
  },
  {
    path: 'privacy',
    component: PrivacyPolicyComponent,
  },
];
