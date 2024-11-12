import { Component, Inject, Input } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SheetService } from '@/src/services/sheet.service';
import { Response } from '@/src/interfaces/api.interface';
import { MatIconModule } from '@angular/material/icon';
import { Sheet, SheetSheetFront } from '@/src/interfaces/sheet.interface';

@Component({
  selector: 'app-sheet-csv-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './sheet-csv-dialog.component.html',
  styleUrl: './sheet-csv-dialog.component.css',
})
export class SheetCSVDialogComponent {
  @Input() prName: string;
  @Input() username: string;
  @Input() sheet: Sheet;
  @Input() sheetSheetFrontModel: SheetSheetFront[];

  constructor(
    public dialogSheetCsv: MatDialogRef<SheetCSVDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.prName = data.prName;
    this.username = data.username;
    this.sheet = data.sheet;
    this.sheetSheetFrontModel = data.sheetSheetFrontModel;
  }

  convertToCSV(sheetSheetFrontModel: SheetSheetFront[]): string {
    const reorderFields = (row: any) => {
      const { _id, rank, score, comment, ...rest } = row;
      return { ...rest, rank, score, comment };
    };

    const reorderedData = sheetSheetFrontModel.map(reorderFields);

    const header = Object.keys(reorderedData[0]).join(',');
    const rows = reorderedData
      .map((row) => Object.values(row).join(','))
      .join('\n');
    return `${header}\n${rows}`;
  }

  downloadCSV(): void {
    const csv = this.convertToCSV(this.sheetSheetFrontModel);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.prName}_${this.username}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportSheet(): void {
    this.downloadCSV();
    this.snackBar.open('Sheet exported', 'Close', {
      duration: 2000,
    });
  }

  async updateSheet(): Promise<Response> {
    this.sheet.sheet = this.sheetSheetFrontModel;
    console.log(this.sheet);
    return await new SheetService().putSheet(this.sheet.prId, this.sheet);
  }

  transferEditToSheet(csvSheet: SheetSheetFront[]): void {
    this.sheetSheetFrontModel.forEach((sheet) => {
      const csvRow = csvSheet.find((csv) => csv.uuid === sheet.uuid);
      if (csvRow) {
        sheet.rank = csvRow.rank;
        sheet.score = csvRow.score;
        sheet.comment = csvRow.comment || '';
      }
    });
  }

  countSpecificChar(str: string, char: string): number {
    return str.split(char).length - 1;
  }
  
  processCSV(csv: string): SheetSheetFront[] {
    const rows = csv.split('\n');
    const typeOfSeparator = this.countSpecificChar(rows[0], ',') > this.countSpecificChar(rows[0], ';') ? ',' : ';';
    const header = rows[0].split(typeOfSeparator).map(key => key.trim().replace(/^"|"$/g, ''));
    const data = rows.slice(1).map((row) => {
      const values = row.split(typeOfSeparator).map(value => value.trim().replace(/\r$/, ''));
      return header.reduce((acc: { [key: string]: any }, key, index) => {
        acc[key] = values[index];
        return acc;
      }, {});
    });
    console.log(data);
    return data as SheetSheetFront[];
  }

  importCSV(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.style.display = 'none';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async () => {
          const csvSheet = this.processCSV(reader.result as string);
          this.transferEditToSheet(csvSheet);
          const response = await this.updateSheet();
          if (response.code !== 200) {
            this.snackBar.open(`Error updating sheet: ${response.data || response.message}`, 'Close', {
              duration: 2000,
            });
            return;
          }
          this.snackBar.open('Sheet updated', 'Close', {
            duration: 2000,
          });
        };
      }
    };
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }
  
  importSheet(): void {
    this.importCSV();
  }
}
