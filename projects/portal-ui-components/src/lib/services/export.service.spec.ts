import { TestBed } from '@angular/core/testing';
import { ExportService } from './export.service';
import * as FileSaver from 'file-saver';

describe('ExportService', () => {
  let service: ExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportService]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(ExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('exportExcel: should export excel', () => {
    const data = [];
    data.push({
      hello: 'world'
    });

    const spy = spyOn(FileSaver, 'saveAs').and.returnValue(null);

    service.exportExcel(data, 'Hello', 'World');
    expect(FileSaver.saveAs).toHaveBeenCalled();
  });

  it('exportExcel: should handle big file name', () => {
    const data = [];
    data.push({
      hello: 'world'
    });

    const spy = spyOn(FileSaver, 'saveAs').and.returnValue(null);

    service.exportExcel(data, 'HelloworldIamaverybignameforafiletobepractical_Iamtired', 'World');
    expect(FileSaver.saveAs).toHaveBeenCalled();
  });
});


