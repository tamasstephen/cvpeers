import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';
import { provideRouter, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { fn } from '@storybook/test';

const modules = [
  ReactiveFormsModule,
  RouterLink,
  InputTextModule,
  ButtonModule,
];

class MockAuthService extends AuthService {
  override login(email: string, password: string) {
    return of({});
  }
}

const meta: Meta<LoginComponent> = {
  component: LoginComponent,
  title: 'Login',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [...modules],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        provideAnimations(),
      ],
    }),
    componentWrapperDecorator(
      (story) =>
        `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">${story}</div>`
    ),
  ],
  args: {
    login: fn(),
  },
  render: (args: LoginComponent) => ({
    props: {
      ...args,
    },
  }),
};

export default meta;

type LoginStory = StoryObj<LoginComponent>;

export const Default: LoginStory = {
  args: {
    login: () => ({
      email: 'test@test.com',
      password: 'password',
    }),
  },
};
