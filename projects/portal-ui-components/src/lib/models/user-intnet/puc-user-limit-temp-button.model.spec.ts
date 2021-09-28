import { PucUserLimitTempButton } from './puc-user-limit-temp-button.model';

describe('PucUserLimitTempButton', () => {
  it('should create an instance', () => {
    expect(new PucUserLimitTempButton()).toBeTruthy();
  });

  it('check if relevant items are present', () => {
    const modelClass: PucUserLimitTempButton = {
      id: '@someId',
      value: 123
    };

    expect(modelClass.id).toEqual('@someId');
    expect(modelClass.value).toEqual(123);
  });
});
