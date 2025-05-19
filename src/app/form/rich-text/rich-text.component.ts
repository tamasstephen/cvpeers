import {
  Component,
  input,
  OnInit,
  signal,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Quill, { Delta, QuillOptions } from 'quill';
import 'quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

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

@Component({
  selector: 'app-rich-text',
  imports: [],
  templateUrl: './rich-text.component.html',
  styleUrl: './rich-text.component.scss',
})
export class RichTextComponent implements OnInit, AfterViewInit {
  parentForm = input.required<FormGroup>();

  initialValues = input<any>(null);

  quill = signal<Quill | null>(null);

  controller = new AbortController();

  summary = new FormControl('', {
    validators: [Validators.required],
  });

  @ViewChild('editor') editor!: ElementRef;

  ngOnInit() {
    console.log('Editor: ', this.editor);
    this.parentForm()?.addControl('summary', this.summary);
  }

  ngAfterViewInit() {
    this.quill.set(new Quill(this.editor.nativeElement, quillOptions));
    this.quill()?.on(
      'text-change',
      () => {
        const currentDelta = this.quill()?.getContents();
        if (currentDelta) {
          const quillHTML = this.quill()?.root.innerHTML;
          const cleanHTML = DOMPurify.sanitize(quillHTML!);
          this.summary.setValue(cleanHTML);
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
