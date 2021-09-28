import { TestBed } from '@angular/core/testing';
import { CountriesService } from './countries.service';

describe('CountriesService', () => {
    let service: CountriesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CountriesService]
        });
        // Returns a service with the MockBackend so we can test with dummy responses
        service = TestBed.inject(CountriesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return the list of countries with display names populated', () => {
        const countryList = service.getCountries();

        expect(countryList.length).toEqual(241);
        expect(countryList[0].displayName).toBeDefined();
    })

    it('should get the country associated with a provided ISO code', () => {
        const country = service.getByIsoName('US');

        expect(country).toBeDefined()
        expect(country.iso).toEqual('US')
    })
});
