import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import DOMPurify from 'dompurify';
import Quill, { QuillOptions } from 'quill';

const quillOptions: QuillOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ],
  },
};

@Component({
  selector: 'app-rich-text',
  imports: [],
  templateUrl: './rich-text.component.html',
  styleUrl: './rich-text.component.scss',
})
export class RichTextComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editor') public editor!: ElementRef;

  public parentForm = input.required<FormGroup>();

  public initialValues = input<unknown>(null);

  public quill = signal<Quill | null>(null);

  public controller = new AbortController();

  public summary = new FormControl('', {
    validators: [Validators.required],
  });

  public ngOnInit(): void {
    this.parentForm().addControl('summary', this.summary);
  }

  public ngAfterViewInit(): void {
    this.quill.set(new Quill(this.editor.nativeElement as HTMLElement, quillOptions));
    this.quill()?.on(
      'text-change',
      (): void => {
        const currentDelta = this.quill()?.getContents();
        if (currentDelta) {
          const quillHTML = this.quill()?.root.innerHTML;
          const cleanHTML = DOMPurify.sanitize(quillHTML ?? '');
          this.summary.setValue(cleanHTML);
        } else {
          this.summary.setValue('');
        }
      },
      { signal: this.controller.signal }
    );
  }

  public ngOnDestroy(): void {
    this.controller.abort();
  }
}
