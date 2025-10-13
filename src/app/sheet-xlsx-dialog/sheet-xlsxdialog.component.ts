import { Sheet, SheetSheetFront } from '@/src/interfaces/sheet.interface';
import { SheetService } from '@/src/services/sheet.service';
import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from '@/src/interfaces/api.interface';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sheet-xlsxdialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './sheet-xlsx-dialog.component.html',
  styleUrl: './sheet-xlsx-dialog.component.css'
})
export class SheetXLSXDialogComponent {
  @Input() prName: string;
  @Input() username: string
  @Input() sheet: Sheet;
  @Input() sheetSheetFrontModel: SheetSheetFront[];

  constructor(
    public dialongSheetXlsx: MatDialogRef<SheetXLSXDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.prName = data.prName;
    this.username = data.username;
    this.sheet = data.sheet;
    this.sheetSheetFrontModel = data.sheetSheetFrontModel;
  }

  downloadXLSX(): void {
    const headerOrder = [
      'uuid', 'orderId', 'artist', 'title', 'source', 'type', 'urlVideo', 'urlAudio', 'rank', 'score', 'comment'
    ];

    const reorderedData = this.sheetSheetFrontModel.map((row) => {
      const newRow: { [key: string]: any } = {};
      headerOrder.forEach(key => {
        newRow[key] = row[key] !== undefined ? row[key] : '';
      });
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet([], { header: headerOrder });
    XLSX.utils.sheet_add_json(worksheet, reorderedData, { skipHeader: true, origin: 'A2' });

    worksheet['!cols'] = worksheet['!cols'] || [];
    worksheet['!cols'][0] = { hidden: true };

    const lastCol = String.fromCharCode('A'.charCodeAt(0) + headerOrder.length - 1);
    worksheet['!autofilter'] = { ref: `A1:${lastCol}1` };

    const urlCols: Record<string, number> = { urlVideo: headerOrder.indexOf('urlVideo'), urlAudio: headerOrder.indexOf('urlAudio') };
    reorderedData.forEach((row, i) => {
      ['urlVideo', 'urlAudio'].forEach(field => {
        const value = row[field];
        if (value && typeof value === 'string' && value.startsWith('http')) {
          const cellRef = XLSX.utils.encode_cell({ c: urlCols[field], r: i + 1 });
          worksheet[cellRef].l = { Target: value, Tooltip: `Ouvrir ${field}` };
        }
      });
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, this.prName);
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.prName}_${this.username}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportSheet(): void {
    this.downloadXLSX();
    this.snackBar.open('XLSX file has been downloaded.', 'Close', {
      duration: 2000,
    });
  }

  async updateSheet(): Promise<Response> {
    this.sheet.sheet = this.sheetSheetFrontModel;
    console.log(this.sheet);
    return await new SheetService().putSheet(this.sheet.prId, this.sheet);
  }

  transferEditToSheet(xlsxSheet: SheetSheetFront[]): void {
    this.sheetSheetFrontModel.forEach((sheet) => {
      const xlsxRow = xlsxSheet.find((xlsx) => xlsx.uuid === sheet.uuid);
      if (xlsxRow) {
        sheet.rank = xlsxRow.rank;
        sheet.score = xlsxRow.score;
        sheet.comment = xlsxRow.comment || '';
      }
    });
  }

  importXLSX(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        const jsonData: SheetSheetFront[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' }) as SheetSheetFront[];
        this.transferEditToSheet(jsonData);
        const response = await this.updateSheet();
        if (response.code !== 200) {
          this.snackBar.open(`Error updating sheet: ${response.message}`, 'Close', {
            duration: 2000,
          });
          return;
        }
        this.snackBar.open('Sheet updated', 'Close', {
          duration: 2000,
        });
      };
      reader.readAsArrayBuffer(file);
    };
    input.click();
  }

  importSheet(): void {
    this.importXLSX();
  }
}
