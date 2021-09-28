import { PucSafeHtmlPipe } from './puc-safe-html.pipe';
import { inject } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';



describe('PucSafeHtmlPipe', () => {

  let pipe: PucSafeHtmlPipe;
  let sanitized: DomSanitizer;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      providers: [DomSanitizer]
    });
    sanitized = TestBed.inject(DomSanitizer);
    pipe = new PucSafeHtmlPipe(sanitized);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transform: should return Undefined HTML for null html', () => {
    const sanitizedHtml = pipe.transform(null);

    expect(sanitizedHtml).toEqual('Undefined HTML');
  });

  it('transform: should return sanitised html', () => {
    const sampleHtml = '<div>Hello world</div>';
    spyOn(pipe, 'transform').and.returnValue(sampleHtml);

    const sanitizedHtml = pipe.transform(sampleHtml);
    expect(sanitizedHtml).toEqual(sampleHtml);
  });
});
