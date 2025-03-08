import { Component, input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Quill, { Delta, QuillOptions } from 'quill';

const quillOptions: QuillOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: [1, 2, 3, 4, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ],
  },
};

function convertDeltaToString(delta: Delta) {
  return JSON.stringify({ delta });
}

function convertStringToDelta(string: string) {
  return JSON.parse(string);
}

@Component({
  selector: 'app-rich-text',
  imports: [],
  templateUrl: './rich-text.component.html',
  styleUrl: './rich-text.component.scss',
})
export class RichTextComponent implements OnInit {
  parentForm = input.required<FormGroup>();
  quill = signal<Quill | null>(null);
  controller = new AbortController();
  summary = new FormControl('', {
    validators: [Validators.required],
  });

  ngOnInit() {
    this.quill.set(new Quill('#editor', quillOptions));
    this.parentForm()?.addControl('summary', this.summary);
    this.quill()?.on(
      'text-change',
      () => {
        // Get data in html format:  console.log('html', this.quill()?.container.innerHTML);
        const currentDelta = this.quill()?.getContents();
        if (currentDelta) {
          this.summary.setValue(convertDeltaToString(currentDelta));
          console.log('summary', this.summary.value);
        } else {
          this.summary.setValue('');
        }
      },
      { signal: this.controller.signal }
    );
  }

  ngOnDestroy() {
    this.controller.abort();
  }
}
