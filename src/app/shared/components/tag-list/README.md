# TagListComponent

A generic, reusable component for creating form sections that allow users to add and remove items from a list. Perfect for skills, expertise, strengths, hobbies, or any other tag-based input. Items are displayed as removable chips for a clean, compact design.

## Usage

```html
<app-tag-list
  [parentForm]="parentForm()"
  title="Your Section Title"
  formControlName="yourFieldName"
  placeholder="Type your item"
  addButtonLabel="Add your item"
></app-tag-list>
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `parentForm` | `FormGroup` | - | The parent form group to register this component's form control |
| `title` | `string` | `'Items'` | The heading displayed above the component |
| `formControlName` | `string` | `'items'` | The name of the form control (will be suffixed with 'Form') |
| `placeholder` | `string` | `'Type your item'` | Placeholder text for the input field |
| `addButtonLabel` | `string` | `'Add your item'` | Label text shown above the input field |

## Examples

### Skills/Expertise Section
```html
<app-tag-list
  [parentForm]="cvForm"
  title="Skills"
  formControlName="expertise"
  placeholder="Type your expertise"
  addButtonLabel="Add your expertise"
></app-tag-list>
```

### Strengths Section
```html
<app-tag-list
  [parentForm]="cvForm"
  title="Strengths"
  formControlName="strengths"
  placeholder="Type your strength"
  addButtonLabel="Add your strength"
></app-tag-list>
```

### Hobbies Section
```html
<app-tag-list
  [parentForm]="cvForm"
  title="Hobbies & Interests"
  formControlName="hobbies"
  placeholder="Type your hobby"
  addButtonLabel="Add your hobby"
></app-tag-list>
```

## Form Integration

The component automatically registers a FormArray with your parent form using the pattern `{formControlName}Form`. For example:

- `formControlName="expertise"` creates `expertiseForm` in the parent form
- `formControlName="strengths"` creates `strengthsForm` in the parent form

## Features

- ✅ Add items by typing and pressing Enter or clicking the plus button
- ✅ Remove items by clicking the X on each chip
- ✅ Input validation (empty/whitespace-only items are rejected)
- ✅ Responsive chip layout that wraps to new lines
- ✅ Clean, compact design using PrimeNG chips
- ✅ Fully configurable labels and placeholders
- ✅ Automatic form integration with ReactiveFormsModule

## Design

Items are displayed as chips with built-in remove functionality. The chips wrap to new lines automatically and provide a clean, space-efficient way to display multiple items. Each chip has a hover effect on the remove icon for better user experience.
