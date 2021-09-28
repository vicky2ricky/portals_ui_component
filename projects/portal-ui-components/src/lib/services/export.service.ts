import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
declare var XLSX:any;
@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';

  public exportExcel(jsonData: any[], fileName: string, header): void {
    let ws: any = XLSX.utils.json_to_sheet([{
      header
    }], {
      skipHeader: true
    });
    ws = XLSX.utils.sheet_add_json(ws, jsonData, { origin: 'A3' });
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    let sheetName = fileName.split('_')[0];
    sheetName = sheetName.length > 31 ? sheetName.substring(0, 30) : sheetName;
    const d = {
    };
    d[sheetName] = ws;
    const wb: any = { Sheets: d, SheetNames: [sheetName] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, fileName);
  }

  public saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.fileType });
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }
}

