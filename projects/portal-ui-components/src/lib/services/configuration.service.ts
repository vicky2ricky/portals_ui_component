import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Configuration {
  pubNub: {
    publishKey: string;
    subscribeKey: string;
    ssl: true
  };
  stage: string;
  haystackUrl: string;
  alertsUrl: string;
  ssapUrl: string;
  omnitrixUrl: string;
  loggingUrl: string;
  auth: {
    caretakerUrl: string,
    gatekeeperUrl: string,
    appSecret: string
  };
}
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private readonly CONFIG_URL = 'assets/config/config.json';
  appConfig = {};

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    return this.http.get<Configuration>(this.CONFIG_URL)
      .toPromise()
      .then(data => {
        this.appConfig = data;
      });
  }

  getConfig(key) {

    return this.appConfig[key];
  }
}
