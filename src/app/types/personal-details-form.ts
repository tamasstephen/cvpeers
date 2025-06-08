import { FormControl, FormGroup } from '@angular/forms';

export type PersonalDetailsForm = FormGroup<{
  fullName: FormControl<PersonalDetailsFormValues['fullName']>;
  email: FormControl<PersonalDetailsFormValues['email']>;
  phone: FormControl<PersonalDetailsFormValues['phone']>;
  website: FormControl<PersonalDetailsFormValues['website']>;
  headline: FormControl<PersonalDetailsFormValues['headline']>;
}>;

export type PersonalDetailsFormValues = {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  headline: string | null;
};
