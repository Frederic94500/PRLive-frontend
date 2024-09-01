import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';

import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PRInput } from '@/src/interfaces/pr.interface';
import { PRService } from '@/src/services/pr.service';
import { Response } from '@/src/interfaces/api.interface';

@Component({
  selector: 'app-pr-create',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatInputModule,
    MatButton,
  ],
  templateUrl: './pr-create.component.html',
  styleUrl: './pr-create.component.css',
})
export class PRCreateComponent implements OnInit {
  name!: string;
  @Input() prForm!: FormGroup;
  prService: PRService = new PRService();

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.prForm = this.formBuilder.group({
      name: ['', Validators.required],
      nomination: [false, Validators.required],
      blind: [false, Validators.required],
      deadlineNomination: [''],
      deadline: ['', Validators.required],
      songList: [null, Validators.required],
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result as string);
          console.log(json);
          this.prForm.get('songList')?.setValue(json);
        } catch (e) {
          console.error('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  }

  onSubmit(): void {
    if (this.prForm.invalid) {
      this.snackBar.open('Please fill all the fields', 'Close', {
        duration: 2000,
      });
      return;
    }

    const prInput: PRInput = this.prForm.value;
    const response = this.prService.createPR(prInput);
    response.then((res: Response) => {
      if (res.code === 201) {
        console.log('PR created');
      } else {
        console.log('Error creating PR: ', res.data);
      }
    });
  }
}
