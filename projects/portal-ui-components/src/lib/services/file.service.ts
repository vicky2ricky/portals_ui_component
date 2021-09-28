import { ConfigurationService } from './configuration.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  filesSelected = false;

  constructor(
    private configService: ConfigurationService,
    private httpClient: HttpClient
  ) {
  }

  uploadFile(file: File, siteRef: string, floorRef: string): Observable<any> {
    const fileName = `${siteRef}/${floorRef}`;
    const filestorageUrl = this.configService.getConfig('filestorageUrl');

    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient.put<any>(`${filestorageUrl}/files/floorplans/${fileName}`, formData);
  }

  getFileAsText(siteRef: string, floorRef: string): Observable<string> {
    const fileName = `${siteRef}/${floorRef}`;
    const filestorageUrl = this.configService.getConfig('filestorageUrl');

    return this.httpClient.get<string>(`${filestorageUrl}/files/floorplans/${fileName}`, { responseType: 'text' as 'json' }).pipe();
  }

  convertToFile(blobFile: Blob, fileName: string): File {
    const blob: any = blobFile;

    blob.lastModifiedDate = new Date();
    blob.name = fileName;
    return blobFile as File;
  }


  saveSelections(siteId, floorId, selections) {
    const pasUrl = this.configService.getConfig('pasUrl');
    // tslint:disable-next-line: max-line-length
    const url = `${pasUrl}/heatmap/floorplan/site/${siteId}/floor/${floorId}`;
    if (selections instanceof FormData) {
      return this.httpClient.post<any>(`${url}`, selections).pipe();
    } else {
      return this.httpClient.put<any>(`${url}`, selections).pipe();
    }
  }


  getSelections(siteId, floorId) {
    const pasUrl = this.configService.getConfig('pasUrl');
    const url = `${pasUrl}/heatmap/floorplan/site/${siteId}/floor/${floorId}`;
    return this.httpClient.get<any>(`${url}`).pipe();
  }
}
