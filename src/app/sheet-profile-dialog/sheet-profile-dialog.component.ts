import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Sheet } from '@/src/interfaces/sheet.interface';
import { SheetService } from '@/src/services/sheet.service';
import { UserService } from '@/src/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sheet-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    FormsModule,
  ],
  templateUrl: './sheet-profile-dialog.component.html',
  styleUrl: './sheet-profile-dialog.component.css',
})
export class SheetProfileDialogComponent {
  prId: string;
  sheet: Sheet;
  sheetService: SheetService = new SheetService();
  userService: UserService = new UserService();

  constructor(
    private snackBar: MatSnackBar,
    public dialogSheet: MatDialogRef<SheetProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.prId = data.prId;
    this.sheet = data.sheet;
  }

  isValidImageUrl(url: string): boolean {
    const pattern = /\.(png|jpe?g|gif|webp)$/i;
    return pattern.test(url);
  }

  async updateSheet(): Promise<void> {
    if (!this.sheet.image) {
      this.snackBar.open('Image is required', 'Close', {
        duration: 2000,
      });
      return;
    }
    if (!this.isValidImageUrl(this.sheet.image)) {
      this.snackBar.open('Invalid image URL', 'Close', {
        duration: 2000,
      });
      return;
    }
    const response = await this.sheetService.putSheet(this.prId, this.sheet);
    if (response.code === 200) {
      this.snackBar.open('Sheet updated', 'Close', {
        duration: 2000,
      });
    } else {
      this.snackBar.open(`Error updating sheet: ${response.data}`, 'Close', {
        duration: 2000,
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e: any) => {
          const response = await this.userService.imageUpload(file);
          if (response.code !== 200) {
            this.snackBar.open(
              `Error uploading image: ${response.data}`,
              'Close',
              {
                duration: 2000,
              }
            );
            return;
          }
          this.sheet.image = response.data;
          this.updateSheet();
          input.value = '';
        };
        reader.readAsDataURL(file);
      }
    }
  }
}
