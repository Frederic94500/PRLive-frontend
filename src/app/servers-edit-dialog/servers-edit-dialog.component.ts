import { Server } from '@/src/interfaces/server.interface';
import { ServerService } from '@/src/services/server.service';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-servers-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
  ],
  templateUrl: './servers-edit-dialog.component.html',
  styleUrl: './servers-edit-dialog.component.css'
})
export class ServersEditDialogComponent {
  serverData: Server;
  serverForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ServersEditDialogComponent>,
    private serverService: ServerService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.serverData = data.server;
    this.serverForm = this.formBuilder.group({
      name: [this.serverData.name, Validators.required],
      discordId: [this.serverData.discordId, Validators.required],
      threadsId: [this.serverData.threadsId, Validators.required],
      announceId: [this.serverData.announceId, Validators.required],
      roleId: [this.serverData.roleId, Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.serverForm.invalid) {
      this.snackBar.open('Please fill out all fields', 'Close', {
        duration: 3000,
      });
      return;
    }

    let serverData: Server = this.serverForm.value;
    this.serverService.edit(this.serverData._id!, serverData).then((response) => {
      if (response.code !== 200) {
        this.snackBar.open('Error updating server', 'Close', {
          duration: 3000,
        });
        return;
      }

      this.snackBar.open('Server updated', 'Close', {
        duration: 3000,
      });
      this.dialogRef.close();
    });
  }
}
