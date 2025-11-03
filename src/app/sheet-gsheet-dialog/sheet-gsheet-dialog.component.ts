import { Response } from '@/src/interfaces/api.interface';
import { Sheet, SheetSheetFront } from '@/src/interfaces/sheet.interface';
import { SheetService } from '@/src/services/sheet.service';
import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sheet-gsheet-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './sheet-gsheet-dialog.component.html',
  styleUrl: './sheet-gsheet-dialog.component.css'
})
export class SheetGsheetDialogComponent {
  @Input() sheet: Sheet;

  constructor(
    public dialogSheetGsheet: MatDialogRef<SheetGsheetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.sheet = data.sheet;
  }

  async importSheet(): Promise<void> {
    new SheetService().getImportGSheet(this.sheet.prId, this.sheet.voterId, this.sheet._id).then((res: Response) => {
      if (res.code === 200 || res.code === 201) {
        this.snackBar.open('Google Sheet imported successfully.', 'Close', { duration: 3000 });
        this.dialogSheetGsheet.close(true);
      } else {
        this.snackBar.open(`Error: ${res.message}`, 'Close', { duration: 5000 });
      }
    });
  }

  async exportSheet(): Promise<void> {
    this.snackBar.open('Generating Google Sheet link...', 'Close', { duration: 5000 });
    new SheetService().getGSheetLink(this.sheet.prId, this.sheet.voterId, this.sheet._id).then((res) => {
      if (res.code === 200 || res.code === 201) {
        const gsheetLink = res.data;
        window.open(gsheetLink, '_blank');
        this.snackBar.open('Google Sheet link generated successfully.', 'Close', { duration: 5000 });
      } else {
        this.snackBar.open(`Error: ${res.message}`, 'Close', { duration: 5000 });
      }
    });
  }
}
