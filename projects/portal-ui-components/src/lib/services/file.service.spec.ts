import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, resetFakeAsyncZone, TestBed, tick } from '@angular/core/testing';
import { ConfigurationService } from './configuration.service';

import { FileService } from './file.service';

class MockConfigurationService extends ConfigurationService {
  getConfig(something: any) {
    return 'http://dummyUrl';
  }
}

describe('FileService', () => {
  let service: FileService;
  let configService: MockConfigurationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FileService,
        {
          provide: ConfigurationService,
          useClass: MockConfigurationService
        }]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(FileService);
    configService = TestBed.inject(ConfigurationService);
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('uploadFile: should successfully upload file', fakeAsync(() => {
    const blob = new Blob([''], { type: 'text/html' });
    blob['lastModifiedDate'] = '';
    blob['name'] = 'filename';
    const fakeF = blob as File;

    const req = httpTestingController.expectNone(`${configService.getConfig('')}/files/floorplans/@123/@456`);

    const sub = service.uploadFile(fakeF, '@123', '@456');
    tick();

    expect(sub.subscribe(resp => {
      expect(resp).toEqual({});
    }));
  }));

  it('getFileAsText: should successfully return file', fakeAsync(() => {
    const req = httpTestingController.expectNone(`${configService.getConfig('')}/files/floorplans/@123/@456`);

    const sub = service.getFileAsText('@123', '@456');
    tick();

    expect(sub.subscribe(resp => {
      expect(resp).toEqual('');
    }));
  }));

  it('convertToFile: should successfully convert file', () => {
    const blob = new Blob([''], { type: 'text/html' });
    blob['lastModifiedDate'] = '';
    blob['name'] = 'filename';
    const fakeF = blob as File;

    const sub = service.convertToFile(fakeF, 'dummyBlob');

    expect(sub).toEqual(fakeF);
  });
});
