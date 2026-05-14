import { CreateAppointmentDto } from './CreateAppointmentDto.js';
import { UpdateAppointmentDto } from './UpdateAppointmentDto.js';

describe('CreateAppointmentDto', () => {
  it('should be defined', () => {
    expect(new CreateAppointmentDto()).toBeDefined();
  });
});

describe('UpdateAppointmentDto', () => {
  it('should be defined', () => {
    expect(new UpdateAppointmentDto()).toBeDefined();
  });
});
