import { AbilitiFactory } from 'src/apility/abiliti-factory/abiliti-factory';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { CheckAbility, requir } from '../decorators/authorize.decorator';
import { ForbiddenError } from '@casl/ability';
@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilitiFactory: AbilitiFactory,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<requir[]>(
      'check-ability',
      context.getHandler(),
    );

    const { user } = context.switchToHttp().getRequest();
    const body=context.switchToHttp().getRequest().body;
    console.log(body + '   canActivate');

    try {
      const ability = await this.abilitiFactory.defineAbility(user);
      console.log('  try canActivate');
      roles.forEach((role) => {
        console.log(role.action + '  ' + role.subject + '   canActivate');
        ForbiddenError.from(ability)
          .setMessage('has not ability')
          .throwUnlessCan(role.action, role.subject);
      });
      console.log('  after try');
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
      console.log('error');
      throw new HttpException(`error type decorator`, HttpStatus.BAD_REQUEST);
    }
  }
}
