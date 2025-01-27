import { Server } from '@/src/interfaces/server.interface';
import { ServerService } from '@/src/services/server.service';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-servers-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './servers-create-dialog.component.html',
  styleUrl: './servers-create-dialog.component.css',
})
export class ServersCreateDialogComponent {
  serverForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ServersCreateDialogComponent>,
    private serverService: ServerService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.serverForm = this.formBuilder.group({
      name: ['', Validators.required],
      discordId: ['', Validators.required],
      threadsId: ['', Validators.required],
      announceId: ['', Validators.required],
      roleId: ['', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit(): Promise<void> {
    if (this.serverForm.invalid) {
      this.snackBar.open('Please fill out all fields', 'Close', {
        duration: 3000,
      });
      return;
    }

    let serverData: Server = this.serverForm.value;
    const response = await this.serverService.create(serverData);
    if (response.code !== 201) {
      this.snackBar.open(`Error when creating server ${response.data}`, 'Close', {
        duration: 3000,
      });
      return;
    }
    this.snackBar.open('Server created successfully', 'Close', {
      duration: 3000,
    });
    this.dialogRef.close();
  }
}
