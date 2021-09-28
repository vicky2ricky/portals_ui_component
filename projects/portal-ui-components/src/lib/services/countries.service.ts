import { Injectable } from '@angular/core';
import { countries } from '../constants/countries'


@Injectable({ providedIn: 'root' })
export class CountriesService {
    constructor() {
    }

    getCountries() {
        return countries.map(country => ({
            ...country,
            displayName: `${country.flag} ${country.name} (+${country.dialCode})`
        }));
    }

    getByIsoName(isoName: string) {
        return countries.find(country => country.iso === isoName);
    }
}