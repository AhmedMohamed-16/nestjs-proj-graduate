import { Module } from '@nestjs/common';
import { AbilitiFactory } from './abiliti-factory/abiliti-factory';
import { AdminService } from 'src/admin/admin.service';
import { AdminModule } from 'src/admin/admin.module';
import { PharmacyModule } from 'src/pharmacy/pharmacy.module';

@Module({
  imports: [AdminModule],
  providers: [AbilitiFactory],
  exports: [AbilitiFactory],
})
export class AbilityModule {}
