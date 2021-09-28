import 'moment-timezone';

import * as moment_ from 'moment';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const moment = moment_;
const baseUrl = 'api';

@Injectable({
  providedIn: 'root'
})

export class SiteService {
  url: string;
  url$: Subject<string> = new Subject<string>();
  loggingUrl: string;
  omnitrixUrl: string;
  caretakerUrl = '';
  // tslint:disable-next-line
  haystackTimezones: string[] = 'Abidjan, Accra, Adak, Addis_Ababa, Adelaide, Aden, Algiers, Almaty, Amman, Amsterdam, Anadyr, Anchorage, Andorra, Antananarivo, Antigua, Apia, Aqtau, Aqtobe, Araguaina, Ashgabat, Asmara, Asuncion, Athens, Atikokan, Auckland, Azores, Baghdad, Bahia, Bahia_Banderas, Bahrain, Baku, Bangkok, Barbados, Beirut, Belem, Belgrade, Belize, Berlin, Bermuda, Beulah, Bishkek, Bissau, Blanc-Sablon, Boa_Vista, Bogota, Boise, Brisbane, Broken_Hill, Brunei, Brussels, Bucharest, Budapest, Buenos_Aires, Cairo, Cambridge_Bay, Campo_Grande, Canary, Cancun, Cape_Verde, Caracas, Casablanca, Casey, Catamarca, Cayenne, Cayman, Center, Ceuta, Chagos, Chatham, Chicago, Chihuahua, Chisinau, Chita, Choibalsan, Christmas, Chuuk, Cocos, Colombo, Comoro, Copenhagen, Cordoba, Costa_Rica, Creston, Cuiaba, Curacao, Currie, Damascus, Danmarkshavn, Dar_es_Salaam, Darwin, Davis, Dawson, Dawson_Creek, Denver, Detroit, Dhaka, Dili, Djibouti, Dubai, Dublin, DumontDUrville, Dushanbe, Easter, Edmonton, Efate, Eirunepe, El_Aaiun, El_Salvador, Enderbury, Eucla, Fakaofo, Faroe, Fiji, Fortaleza, Funafuti, GMT, GMT+1, GMT+10, GMT+11, GMT+12, GMT+2, GMT+3, GMT+4, GMT+5, GMT+6, GMT+7, GMT+8, GMT+9, GMT-1, GMT-10, GMT-11, GMT-12, GMT-13, GMT-14, GMT-2, GMT-3, GMT-4, GMT-5, GMT-6, GMT-7, GMT-8, GMT-9, Galapagos, Gambier, Gaza, Gibraltar, Glace_Bay, Godthab, Goose_Bay, Grand_Turk, Guadalcanal, Guam, Guatemala, Guayaquil, Guyana, Halifax, Havana, Hebron, Helsinki, Hermosillo, Ho_Chi_Minh, Hobart, Hong_Kong, Honolulu, Hovd, Indianapolis, Inuvik, Iqaluit, Irkutsk, Istanbul, Jakarta, Jamaica, Jayapura, Jerusalem, Johannesburg, Jujuy, Juneau, Kabul, Kaliningrad, Kamchatka, Kampala, Karachi, Kathmandu, Kerguelen, Khandyga, Khartoum, Kiev, Kiritimati, Knox, Kolkata, Kosrae, Krasnoyarsk, Kuala_Lumpur, Kuching, Kuwait, Kwajalein, La_Paz, La_Rioja, Lagos, Lima, Lindeman, Lisbon, London, Lord_Howe, Los_Angeles, Louisville, Luxembourg, Macau, Maceio, Macquarie, Madeira, Madrid, Magadan, Mahe, Majuro, Makassar, Maldives, Malta, Managua, Manaus, Manila, Maputo, Marengo, Marquesas, Martinique, Matamoros, Mauritius, Mawson, Mayotte, Mazatlan, Melbourne, Mendoza, Menominee, Merida, Metlakatla, Mexico_City, Midway, Minsk, Miquelon, Mogadishu, Monaco, Moncton, Monrovia, Monterrey, Montevideo, Monticello, Montreal, Moscow, Muscat, Nairobi, Nassau, Nauru, Ndjamena, New_Salem, New_York, Nicosia, Nipigon, Niue, Nome, Norfolk, Noronha, Noumea, Novokuznetsk, Novosibirsk, Ojinaga, Omsk, Oral, Oslo, Pago_Pago, Palau, Palmer, Panama, Pangnirtung, Paramaribo, Paris, Perth, Petersburg, Phnom_Penh, Phoenix, Pitcairn, Pohnpei, Pontianak, Port-au-Prince, Port_Moresby, Port_of_Spain, Porto_Velho, Prague, Puerto_Rico, Pyongyang, Qatar, Qyzylorda, Rainy_River, Rangoon, Rankin_Inlet, Rarotonga, Recife, Regina, Rel, Resolute, Reunion, Reykjavik, Riga, Rio_Branco, Rio_Gallegos, Riyadh, Rome, Rothera, Saipan, Sakhalin, Salta, Samara, Samarkand, San_Juan, San_Luis, Santa_Isabel, Santarem, Santiago, Santo_Domingo, Sao_Paulo, Scoresbysund, Seoul, Shanghai, Simferopol, Singapore, Sitka, Sofia, South_Georgia, Srednekolymsk, St_Johns, Stanley, Stockholm, Swift_Current, Sydney, Syowa, Tahiti, Taipei, Tallinn, Tarawa, Tashkent, Tbilisi, Tegucigalpa, Tehran, Tell_City, Thimphu, Thule, Thunder_Bay, Tijuana, Tirane, Tokyo, Tongatapu, Toronto, Tripoli, Troll, Tucuman, Tunis, UCT, UTC, Ulaanbaatar, Urumqi, Ushuaia, Ust-Nera, Uzhgorod, Vancouver, Vevay, Vienna, Vientiane, Vilnius, Vincennes, Vladivostok, Volgograd, Vostok, Wake, Wallis, Warsaw, Whitehorse, Winamac, Windhoek, Winnipeg, Yakutat, Yakutsk, Yekaterinburg, Yellowknife, Yerevan, Zaporozhye, Zurich'.split(', ');
  haystackTimezoneMap: any = {};
  alertsUrl: string;

  constructor(
    private http: HttpClient, private routerService: Router,
    private configService: ConfigurationService, private authService: AuthenticationService
  ) {
    this.url = this.configService.getConfig('haystackUrl');
    this.loggingUrl = this.configService.getConfig('loggingUrl');
    this.omnitrixUrl = this.configService.getConfig('omnitrixUrl');
    this.alertsUrl = this.configService.getConfig('alertsUrl');
    this.caretakerUrl = this.configService.getConfig('auth').caretakerUrl;
    const momentTimeZones = moment.tz.names();
    this.haystackTimezones.forEach((htz) => this.haystackTimezoneMap[htz] = momentTimeZones.find((mtz) => mtz.includes(htz)));
  }

  getAuthSites(): Observable<any> {

    const userId = this.authService.getUser().userId;
    return this.http.get(`${this.caretakerUrl}/user/${userId}/sites?portal=facilisight`);
  }

  updateSite(siteId,reqbody): Observable<any> {
    return this.http.put(`${this.caretakerUrl}/sites/${siteId}`,reqbody);
  }

  getSites_v1(siteIds): Observable<any> {
    let data = `ver:"2.0"\nid`;
    siteIds.map(siteId => {
      data = `${data}\n${siteId}`;
    });

    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getRooms_v1(siteIds): Observable<any> {

    const siteRefs = [];
    siteIds.map(siteId => {
      siteRefs.push(`siteRef==${siteId}`);
    });

    const data = `ver:"2.0"\nfilter\n"room and (${siteRefs.join(' or ')})"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getCCUs_v1(siteIds): Observable<any> {

    const siteRefs = [];
    siteIds.map(siteId => {
      siteRefs.push(`siteRef==${siteId}`);
    });

    const data = `ver:"2.0"\nfilter\n"ccu and (${siteRefs.join(' or ')})"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getBuildings() {
    const data = `ver:"2.0"\nfilter\n"site"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(
      map((response: any) => {
        const buildings = response.rows.map((site: any) => ({
          _id: site.id.slice(0, site.id.indexOf(' ')).replace(/^r:/, ''),
          name: site.dis,
          geographicAddress: site.geoAddr,
        })).sort((site1: any, site2: any) => site1._id > site2._id ? -1 : site1._id < site2._id ? 1 : 0);
        return buildings;
      }),
    );
  }

  setHttpParams(params) {
    let httpParams = new HttpParams();
    if (params) {

      Object.keys(params).forEach((key, index) => {
        if (params[key] instanceof Object) {
          httpParams = httpParams.append(key, JSON.stringify(params[key]));
        } else {
          httpParams = httpParams.append(key, params[key]);
        }

      });
    }
    return httpParams;
  }

  getTunerLogs(params): Observable<any> {
    params = this.setHttpParams(params);
    return this.http.get(this.loggingUrl + baseUrl + '/logs', { params }).pipe(catchError(this.handleError));
  }

  getBuildingGroups(params): Observable<any> {
    params = this.setHttpParams(params);
    return this.http.get(this.omnitrixUrl + baseUrl + '/buildings', { params }).pipe(catchError(this.handleError));
  }

  getSmartgroups(url, params?) {
    params = params ? this.setHttpParams(params) : {};
    return this.http.get(this.omnitrixUrl + baseUrl + '/' + url, { params }).pipe(catchError(this.handleError));
  }

  getBuildingTree(params) {
    params = this.setHttpParams(params);
    return this.http.get(this.omnitrixUrl + baseUrl + '/buildings', { params }).pipe(catchError(this.handleError));
  }

  getTuners(level, params?) {
    params = this.setHttpParams(params);
    return this.http.get(this.omnitrixUrl + baseUrl + '/tuners/' + level, { params }).pipe(catchError(this.handleError));
  }

  getTunerPoints(level, body) {
    return this.http.post(this.omnitrixUrl + baseUrl + '/tuners/' + level + '/overrides/', body).pipe(catchError(this.handleError));
  }

  getTunerPointIds(level, body) {
    return this.http.post(this.omnitrixUrl + baseUrl + '/tuners/' + level + '/ids', body).pipe(catchError(this.handleError));
  }

  getTunerPointValues(level, body) {
    return this.http.post(this.omnitrixUrl + baseUrl + '/tuners/' + level + '/values', body).pipe(catchError(this.handleError));
  }

  getBulkWritablePointData(pointList: Array<any>) {
    let data = `ver:"2.0"\nid`;
    pointList.forEach((_id) => {
      data += `\n@${_id}`;
    });
    return this.http.post(`${this.url}v2/pointWriteMany/`, data).pipe(catchError(this.handleError));
  }

  updateBulkWritablePointData(pointList) {
    let data = `ver:"2.0"\nid,level,val,who,duration`;
    pointList.forEach(({ ref, level, who, duration, val }) => {
      data += `\n@${ref},${level},${val},"${who}",${duration}`;
    });
    return this.http.post(`${this.url}v2/pointWriteMany/`, data).pipe(catchError(this.handleError));
  }

  createTunerLogs(data: any[]) {
    return this.http.post(this.loggingUrl + baseUrl + '/logs', data).pipe(catchError(this.handleError));
  }

  getEntitiesInBuilding(buildingID: string, filterString: string = null) {
    const data = `ver:"2.0"\nfilter\n"siteRef==@${buildingID}${filterString ? ' and ' + filterString : ''}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getSites(): Observable<any> {
    const data = `ver:"2.0"\nfilter\n"site"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getAllRooms(): Observable<any> {
    const data = `ver:"2.0"\nfilter\n"room"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getAllCcus(): Observable<any> {
    const data = `ver:"2.0"\nfilter\n"ccu"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getSiteEquips(siteRef: any): Observable<any> {
    const data = `ver:"2.0"\nfilter\n"equip and siteRef==@${siteRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getSiteFloors(siteRef: any) {
    const data = `ver:"2.0"\nfilter\n"floor and siteRef==@${siteRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getSiteZones(siteRef: any) {
    const data = `ver:"2.0"\nfilter\n"zone and siteRef==@${siteRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getFloorDevices(floorRef: any) {
    const data = `ver:"2.0"\nfilter\n"device and floorRef==@${floorRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getCcus(siteRef: any) {
    const data = `ver:"2.0"\nfilter\n"ccu and siteRef==@${siteRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getSiteRooms(siteRef: any) {
    const data = `ver:"2.0"\nfilter\n"room and siteRef==@${siteRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getSiteParams(siteRef: any, param: string) {
    const data = `ver:"2.0"\nfilter\n"${param} and siteRef==@${siteRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }


  getZoneParamsByEquip(equipRef: any, param: string) {
    const data = `ver:"2.0"\nfilter\n"${param} and equipRef==@${equipRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getFloorRooms(floorRef: any) {
    const data = `ver:"2.0"\nfilter\n"room and floorRef==@${floorRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getRoomDevices(roomRef: any) {
    const data = `ver:"2.0"\nfilter\n"device and roomRef==@${roomRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getSitePoints(siteRef: any) {
    const data = `ver:"2.0"\nfilter\n"point and siteRef==@${siteRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getSiteMap(siteRef: any) {
    const data = `ver:"2.0"\nfilter\n"siteRef==@${siteRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getReadById(pointId: string) {
    const data = `ver:"2.0"\nid\n@${pointId}`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getReadByIdMany(pointIds) {
    let data = `ver:"2.0"\nid`;
    for (const point of pointIds) {
      data += '\n@' + point;
    }
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getHisPointData(pointRef: any, range: any): Observable<any> {
    const data = `ver:"2.0"\nid,range\n@${pointRef},"${range}"`;
    return this.http.post<any>(`${this.url}v1/hisRead/`, data).pipe(catchError(this.handleError));
  }

  getWritablePointData(pointRef: any) {
    const data = `ver:"2.0"\nid\n@${pointRef}`;
    return this.http.post(`${this.url}v2/pointWrite/`, data).pipe(catchError(this.handleError));
  }

  getEntityData(pointRef: any) {
    const data = `ver:"2.0"\nid\n@${pointRef}`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  // returns the IANA timezone from a Haystack timezone
  // e.g. when converting tz from site entity
  getIANATimeZone(timezone: string) {
    if (timezone === 'Calcutta') {
      timezone = 'Kolkata';
    }
    return this.haystackTimezoneMap[timezone];
  }

  updateWritablePointData({ ref, level, who, duration, val }) {
    const data = `ver:"2.0"\nid,level,val,who,duration\n@${ref},${level},${val},"${who}",${duration}`;
    return this.http.post(`${this.url}v2/pointWrite/`, data).pipe(catchError(this.handleError));
  }

  addEntity(data: string) {
    return this.http.post(`${this.url}v1/addEntity/`, data).pipe(catchError(this.handleError));
  }

  updateSchedule(scheduleId: string, refId: string, days: string, ref: string = 'siteRef', siteId: string = 'undefined') {
    const data = ref === 'siteRef' ?
      // tslint:disable-next-line
      `ver:"2.0"\nkind,id,dis,cooling,building,siteRef,unit,schedule,days,heating,temp\n"Number",@${scheduleId},"Building Schedule",M,M,@${refId},"\\u00B0F",M,${days},M,M` :
      // tslint:disable-next-line
      `ver:"2.0"\nkind,id,dis,cooling,zone,siteRef,roomRef,unit,schedule,days,heating,temp\n"Number",@${scheduleId},"Zone Schedule",M,M,@${siteId},@${refId},"\\u00B0F",M,${days},M,M`;

    return this.http.post(`${this.url}v1/addEntity/`, data).pipe(catchError(this.handleError));
  }

  getQuerybySite(siteRef: any, query: string) {
    const data = `ver:"2.0"\nfilter\n" ${query} and siteRef==@${siteRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  oaoPairedCheck(ahuRef: any, query: string) {
    const data = `ver:"2.0"\nfilter\n" ${query} and ahuRef==@${ahuRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getZonesListPairedOnCcu(ahuRef: any) {
    const data = `ver:"2.0"\nfilter\n" not ccu and (ahuRef==@${ahuRef} or gatewayRef==@${ahuRef})"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getQuerybyEquipRef(equipRef: any, query: string) {
    const data = `ver:"2.0"\nfilter\n"${query} and equipRef==@${equipRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getZoneParams(queryString: string, roomref: any, siteRef: any) {
    const data = `ver:"2.0"\nfilter\n"${queryString} and roomRef==@${roomref} and siteRef==@${siteRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  queryAssist(queryString: string, endpoint: string) {
    return this.http.post(`${this.url}${endpoint}/`, queryString).pipe(catchError(this.handleError));
  }

  removeEntity(ref: string) {
    const data = `ver:"2.0"\nid\n@${ref}`;
    return this.http.post(`${this.url}v1/removeEntity/`, data).pipe(catchError(this.handleError));
  }

  getDetailsBySiteRef(queryString: string, siteref: any) {
    const data = `ver:"2.0"\nfilter\n"${queryString} and siteRef==@${siteref}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getScheduleParamsByRoomRef(queryString: string, siteref: any) {
    const data = `ver:"2.0"\nfilter\n"${queryString} and roomRef==@${siteref}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getCurrenthisReadMany(pointsList: any) {
    const range = `range:"last"`;
    let data = `ver:"3.0" ${range}\nid`;
    for (const point of pointsList) {
      data += '\n@' + point;
    }
    return this.http.post<any>(`${this.url}v2/hisReadMany/`, data).pipe(catchError(this.handleError));
  }

  gethisReadMany(pointsList: any, daterange: any, timeZone: any) {
    const format = 'YYYY-MM-DDTHH:mm:ssZ';
    const startDate = moment.tz(daterange.startDate.startOf('day'), timeZone).format(format);
    const endDate = moment.tz(daterange.endDate.endOf('day'), timeZone).format(format);
    // tslint:disable-next-line
    const range = 'hisStart:' + startDate + ' ' + this.getHaystackTimeZone(timeZone) + ' ' + 'hisEnd:' + endDate + ' ' + this.getHaystackTimeZone(timeZone);
    let data = `ver:"3.0" ${range}\nid`;
    for (const point of pointsList) {
      data += '\n@' + point;
    }
    return this.http.post<any>(`${this.url}v1/hisReadMany/`, data).pipe(catchError(this.handleError));
  }

  getEquipByGateRef(queryString,gatewayRef) {
    const data = `ver:"2.0"\nfilter\n"${queryString} and gatewayRef==@${gatewayRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  gethisReadManyInterpolate(pointsList: any, daterange: any, timeZone: any) {
    const format = 'YYYY-MM-DDTHH:mm:ssZ';
    const startDate = moment.tz(daterange.startDate, timeZone).format(format);
    const endDate = moment.tz(daterange.endDate, timeZone).format(format);
    // tslint:disable-next-line
    const range = 'hisStart:' + startDate + ' ' + this.getHaystackTimeZone(timeZone) + ' ' + 'hisEnd:' + endDate + ' ' + this.getHaystackTimeZone(timeZone);
    let data = `ver:"3.0" ${range}\nid`;
    for (const point of pointsList) {
      data += '\n@' + point;
    }
    return this.http.post<any>(`${this.url}v1/hisReadManyInterpolate/`, data).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error);
  }

  initHaystackUrl(appUrl: string) {
    this.url = appUrl;
    this.url$.next(appUrl);
    // if (this.routerService.url.split("/")[1]) {
    //     this.routerService.navigate(['/', '']);
    // }
    // else {
    //     this.routerService.navigate(['/', 'heatmap']);
    // }
    const urlpath = localStorage.getItem('url');
    if ((typeof urlpath) === 'string') {
      const urlRouteArray = [];
      urlRouteArray.push('/');
      const urlArray = urlpath.split('/');
      urlArray.forEach((value) => {
        if (value !== '') {
          urlRouteArray.push(value);
        }
      });
      this.routerService.navigate(urlRouteArray, {
        queryParams: { refresh: new Date().getTime() }
      });


    }
    // if (this.routerService.url.split("/")[1]) {
    //     this.routerService.navigate(['/', '']);
    // }
    // else {
    //     this.routerService.navigate(['/', 'dashboard']);
    // }
    console.log(`Setting Haystack endpoint to: ${this.url}`);
  }

  // returns the datetime adjusted to the specified IANA timezone
  inHaystackDateTime(timeObject, timezoneIANA) {
    const format = 'YYYY-MM-DDTHH:mm:ssZ';
    if (timezoneIANA === 'Asia/Kolkatta') {
      return `${moment(timeObject, format).tz(timezoneIANA).format(format)} Calcutta`;
    } else {
      return `${moment(timeObject, format).tz(timezoneIANA).format(format)} ${this.getHaystackTimeZone(timezoneIANA)}`;
    }
  }

  // returns Haystack timezone from IANA timezone
  // e.g. when setting a daterange for hisRead op
  getHaystackTimeZone(timezoneIANA: string) {
    return Object.keys(this.haystackTimezoneMap).find(htz => this.haystackTimezoneMap[htz] === timezoneIANA);
  }

  // returns start of day in specified site timezone
  inHaystackDateTimeForVacation(timeObject, timezoneIANA, type) {
    var timeZone = timezoneIANA;
    if (timezoneIANA == 'Asia/Kolkatta' || timezoneIANA == "Kolkata" || timezoneIANA == "Calcuta" || timezoneIANA == "Calcutta") {
      timeZone = 'Kolkata'
    }
    var format = 'YYYY-MM-DDTHH:mm:ssZ';
    switch (type) {
      case "startDate":
        return `${moment(timeObject).tz(this.haystackTimezoneMap[timeZone],true).startOf('day').tz(this.haystackTimezoneMap[timeZone],true).format(format)} ${timezoneIANA}`;
      case "endDate":
        return `${moment(timeObject).tz(this.haystackTimezoneMap[timeZone],true).endOf('day').tz(this.haystackTimezoneMap[timeZone],true).format(format)} ${timezoneIANA}`;
      default:
        throw Error("Incorrect date type")
    }
  }

  getAlerts(severity,siteRefs: any[],isInternal,
    isFixed?: boolean, searchText?: string,
    page?: number, count?: number, sort?: string, sortDirection?: string) {
      let params ='?';
      siteRefs = siteRefs.map(s=>s.replace('@',''));
      // siteRefs.forEach(s=>{
      //   params+='siteIds='+s.replace('@','')+'&'
      // })
      params+='siteIds='+siteRefs.toString();
      if(isFixed) {
        params+='&isFixed='+!isFixed;
      }
      if(severity) {
        params+='&severity='+severity;
      }

    if (searchText) {
      params+='&searchText='+ searchText;
    }
    if(!isInternal) {
      params+='&alertType=CUSTOMER VISIBLE';
    }
    const url = `${this.alertsUrl}alerts` + params + ((page!=undefined && count ? `&page=${page}&size=${count}` : ``) + (sort ? `&sortField=${sort}` : ``) + (sortDirection ? `&sortDirection=${sortDirection}` : ``));
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  getAlertsCount(data:any){
    let params ='?';
    // data.siteIds.forEach(s=>{
    //   params+='siteIds='+s.replace('@','')+'&'
    // })
    data.siteIds = data.siteIds.map(s=>s.replace('@',''));

    params+='siteIds='+data.siteIds.toString();
    if(data.isFixed) {
      params+='&isFixed='+!data.isFixed;
    }
    if(!data.isInternal) {
      params+='&alertType=CUSTOMER VISIBLE';
    }
    return this.http.get(`${this.alertsUrl}alerts/count`+params).pipe(catchError(this.handleError));
  }

  getAlertsList(alerttype, siteRef: string, details: any= {}) {
    const baseUrl = `${this.alertsUrl}definitions/sites/${siteRef}?`;

    let params = new HttpParams();
    params = params.set('custom', String(alerttype === 'customAlert' ? true : false));

    if (details.searchText) {
      params = params.set('searchText', details.searchText);
    }

    if (details.pageNum || details.pageNum == 0) {
      params = params.set('page', details.pageNum);
    }

    if (details.pageSize) {
      params = params.set('size', details.pageSize);
    }

    if (details.sortDirection) {
      params = params.set('sortDirection', details.sortDirection);
    }

    if (details.sortField) {
      params = params.set('sortField', details.sortField);
    }

    return this.http.get(baseUrl, {params}).pipe(catchError(this.handleError));
  }


  enableDisableAlert(enbdis,id,siteref){
    const url = `${this.alertsUrl}definitions/${id}/` + (enbdis ? 'enable' : 'disable')
    let data:any;
    data = {siteRef : siteref}
    return this.http.post(url, data).pipe(catchError(this.handleError));
  }

  createOrUpdateCustomAlert(customAlertData){
    const siteRef = customAlertData.siteRef;
    const existingCustomAlertId = customAlertData.currentId;

    if (existingCustomAlertId) {
      const baseUrl = `${this.alertsUrl}definitions/sites/${siteRef}/${existingCustomAlertId}`;
      return this.http.put(baseUrl, customAlertData.data).pipe(catchError(this.handleError));
    } else {
      const baseUrl = `${this.alertsUrl}definitions/sites/${siteRef}`;
      return this.http.post(baseUrl, customAlertData.data).pipe(catchError(this.handleError));
    }
  }

  deleteCustomAlert(siteRef, alertRef) {
    const baseUrl = `${this.alertsUrl}definitions/sites/${siteRef}/${alertRef}`;
    return this.http.delete(baseUrl).pipe(catchError(this.handleError));
  }

  getEquipPoints(equipRef: string, tags: string[]) {
    const data = `ver:"2.0"\nfilter\n"point and ${tags.length > 0 ? tags.join(' and ') + ' and ' : ''} equipRef==@${equipRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  readEntities(refs: string[]) {
    const data = `ver:"2.0"\nid\n${refs.map(ref => `@${ref}`).join(',')}`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  removeSite(siteRef: string) {
    const data = `ver:"2.0"\nnavId\n@${siteRef}`;
    return this.http.post(`${this.url}v1/removeSite/`, data).pipe(catchError(this.handleError));
  }

  getScheduleParamsBySiteRef(queryString: string, siteref: any) {
    const data = `ver:"2.0"\nfilter\n"${queryString} and siteRef==@${siteref}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getServerTags() {
    return this.http.post(`${this.url}v1/tags/`, `ver:"2.0"\nfilter\n""`).pipe(catchError(this.handleError));
  }

  getWeatherPoints(weatherRef: string) {
    const data = `ver:"2.0"\nfilter\n"weatherPoint and weatherRef==@${weatherRef}"`;
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getSmartgroupById(id, params?) {
    params = params ? this.setHttpParams(params) : {};
    return this.http.get(this.omnitrixUrl + baseUrl + '/smartgroups/' + id, { params }).pipe(catchError(this.handleError));
  }

  deleteSmartgroup(id) {
    return this.http.delete(this.omnitrixUrl + baseUrl + '/smartgroups/' + id).pipe(catchError(this.handleError));
  }

  updateSmartgroup(id, body) {
    return this.http.put(this.omnitrixUrl + baseUrl + '/smartgroups/' + id, body).pipe(catchError(this.handleError));
  }

  bulkUpdateSmartgroup(body) {
    return this.http.post(this.omnitrixUrl + baseUrl + '/smartgroups/bulkUpdate', body).pipe(catchError(this.handleError));
  }

  createSmartgroup(body) {
    return this.http.post(this.omnitrixUrl + baseUrl + '/smartgroups', body).pipe(catchError(this.handleError));
  }

  getAllSites(params) {
    params = params ? this.setHttpParams(params) : {};
    return this.http.get(`${this.caretakerUrl}` + '/sites/search', { params }).pipe(catchError(this.handleError));
  }

  getSiteUsers(siteId, params?) {
    params = params ? this.setHttpParams(params) : {};
    return this.http.get(`${this.caretakerUrl}/sites/${siteId}/users`, {
      params
    }).pipe(catchError(this.handleError));
  }

  getDevicesBySite(siteId, params?) {
    params = params ? this.setHttpParams(params) : {};
    return this.http.get(`${this.caretakerUrl}/sites/${siteId}/devices`, {
      params
    }).pipe(catchError(this.handleError));
  }

  getHaystackDataByQuery(query) {
    const data = `ver:"3.0"\nfilter\n"${query}"`
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getRead(data: string) {
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  getSitesByIds(siteIds): Observable<any> {
    let data = `ver:"2.0"\nid`;
    siteIds.map(siteId => {
        data = `${data}\n${siteId}`
    });
    return this.http.post(`${this.url}v1/read/`, data).pipe(catchError(this.handleError));
  }

  removeCCU(ccuId: string) {
    return this.http.delete(`${this.caretakerUrl}/devices/${ccuId}`).pipe(catchError(this.handleError));
  }

  updateSiteAlert(siteId,alertId,reqBody) {
    return this.http.put(`${this.alertsUrl}definitions/sites/${siteId}/${alertId}`,reqBody).pipe(catchError(this.handleError));
  }

  refreshVerificationCode(siteId, payload) {
    return this.http.post(`${this.caretakerUrl}/siteCode/site/${siteId}/refresh`, payload).pipe(catchError(this.handleError));
  }

  shareSiteCode(siteId, emailAddress) {
    return this.http.post(`${this.caretakerUrl}/siteCode/site/${siteId}/share?emailAddress=${emailAddress}`,{}).pipe(catchError(this.handleError));
  }

}
