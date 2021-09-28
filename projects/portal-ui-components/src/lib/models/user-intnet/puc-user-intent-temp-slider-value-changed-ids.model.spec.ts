import { PucUserIntentTempSliderValueChangedIds } from './puc-user-intent-temp-slider-value-changed-ids.model';

describe('PucUserIntentTempSliderValueChangedIds', () => {
  it('should create an instance', () => {
    expect(PucUserIntentTempSliderValueChangedIds.Cooling).toBeTruthy();
    expect(PucUserIntentTempSliderValueChangedIds.Heating).toBeTruthy();
    expect(PucUserIntentTempSliderValueChangedIds.Deadband).toBeTruthy();
  });
});
