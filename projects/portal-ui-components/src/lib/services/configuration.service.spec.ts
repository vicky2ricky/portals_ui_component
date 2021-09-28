import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ConfigurationService } from './configuration.service';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigurationService]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(ConfigurationService);
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loadAppConfig: should set appConfig', fakeAsync(() => {
    const response = {
      stage: 'dev',
      connectionUrl: 'http://helloworld',
      appUri: '123-456-789'
    };
    service.loadAppConfig();

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      'assets/config/config.json'
    );
    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');
    // Respond with this data when called
    req.flush(response);

    // Call tick whic actually processes te response
    tick();

    expect(service.appConfig).toBe(response);
  }));

  it('getConfig: should return key', () => {
    const appConfig = {
      stage: 'dev',
      connectionUrl: 'http://helloworld',
      appUri: '123-456-789'
    };
    service.appConfig = appConfig;
    expect(service.getConfig('stage')).toBe('dev');
  });
});
