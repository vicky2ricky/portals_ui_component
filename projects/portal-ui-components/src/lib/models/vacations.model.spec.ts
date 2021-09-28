import * as moment from 'moment';
import { Observable } from 'rxjs';
import { VacationScheduleDetails } from './vacations.model';

describe('Vacations', () => {
  it('should create an instance', () => {
    expect(new VacationScheduleDetails('', '', '', '', moment('2020-09-20'), moment('2020-09-21'), true)).toBeTruthy();
  });

  it('should create an instance', () => {
    expect(new VacationScheduleDetails('', '', '', '', moment('2020-09-20'), moment('2020-09-21'))).toBeTruthy();
  });
});
