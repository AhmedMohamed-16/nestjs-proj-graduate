import { SetMetadata } from '@nestjs/common';
import { Action, Subjects } from 'src/apility/abiliti-factory/abiliti-factory';

export interface requir {
  action: Action;
  subject: Subjects;
}
export const CheckAbility = (...ability: requir[]) =>
  SetMetadata('check-ability', ability);
