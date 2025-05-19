import { applicationConfig, type Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
import { importProvidersFrom } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { Noir } from '../src/app/shared/ui/extend.style';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

setCompodocJson(docJson);

const decorators = [
  applicationConfig({
    providers: [
      provideHttpClient(),
      provideRouter([]),
      provideAnimationsAsync(),
      providePrimeNG({
        theme: {
          preset: Noir,
        },
      }),
    ],
  }),
];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators,
};

export default preview;
