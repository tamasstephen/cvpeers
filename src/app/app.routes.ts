import {
  CanMatchFn,
  RedirectCommand,
  ResolveFn,
  Route,
  Router,
  Routes,
  UrlSegment,
} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CvFormComponent } from './form/cv-form/cv-form.component';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './login/auth.service';
import { RegComponent } from './reg/reg.component';

const resolveCvData: ResolveFn<any> = () => {
  const httpClient = inject(HttpClient);
  const res = httpClient.get('http://localhost:3000/api/v1/cv/usr1');
  return res;
};

const canMatch: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = authService.geIstLoggedIn();
  if (!isLoggedIn) {
    return new RedirectCommand(router.parseUrl('/'));
  }
  return true;
};

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'cv',
    component: CvFormComponent,
    /*     resolve: {
      cvData: resolveCvData,
    }, */
    canMatch: [canMatch],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'registration',
    component: RegComponent,
  },
];
