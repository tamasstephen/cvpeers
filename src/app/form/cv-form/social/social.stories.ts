import { Meta, StoryObj } from '@storybook/angular';
import { SocialComponent } from './social.component';
import { SOCIAL_OPTIONS_PROVIDER, SocialItem } from '../../../types/social';
import { moduleMetadata } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SelectModule } from 'primeng/select';
import { signal } from '@angular/core';

const modules = [
  ButtonModule,
  ReactiveFormsModule,
  InputTextModule,
  IftaLabelModule,
  SelectModule,
  DialogModule,
];

const meta: Meta<SocialComponent> = {
  component: SocialComponent,
  title: 'Form/Social',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [...modules],
      providers: [SOCIAL_OPTIONS_PROVIDER],
    }),
  ],
  args: {
    socialForm: new FormGroup({
      social: new FormArray<FormControl<SocialItem>>([]),
    }),
    isDialogOpen: signal(false),
  },
};

type SocialStory = StoryObj<SocialComponent>;

const githubItem = new FormControl<SocialItem>({
  url: 'https://github.com/asdasdsad',
  type: 'github',
}) as FormControl<SocialItem>;

const linkedinItem = new FormControl<SocialItem>({
  url: 'https://linkedin.com/in/asdasdsad',
  type: 'linkedin',
}) as FormControl<SocialItem>;

export const Default: SocialStory = {
  args: {
    isDialogOpen: signal(false),
  },
};

export const WithGithub: SocialStory = {
  args: {
    ...Default.args,
    socialForm: new FormGroup({
      social: new FormArray<FormControl<SocialItem>>([githubItem]),
    }),
  },
};

export const WithLinkedin: SocialStory = {
  args: {
    ...Default.args,
    socialForm: new FormGroup({
      social: new FormArray<FormControl<SocialItem>>([linkedinItem]),
    }),
  },
};

export const WithBoth: SocialStory = {
  args: {
    ...Default.args,
    socialForm: new FormGroup({
      social: new FormArray<FormControl<SocialItem>>([
        githubItem,
        linkedinItem,
      ]),
    }),
  },
};

export const WithDialogOpen: SocialStory = {
  args: {
    ...Default.args,
    isDialogOpen: signal(true),
  },
};

export default meta;
