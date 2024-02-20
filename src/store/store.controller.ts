import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { JwtAuthGaurd } from 'src/auth/guards/jwt-authguard';
import { Store } from './entities/store.entity';
import { CheckAbility } from 'src/auth/decorators/authorize.decorator';
import { Action } from 'src/apility/abiliti-factory/abiliti-factory';
import { StoreService } from './store.service';
import { creatStoreDto, updateStoreDto } from './dto/creat-storeDto';
@Controller('store')
export class StoreController {
  constructor(private readonly StoreService: StoreService) {}

  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Read, subject: Store })
  @Get('')
  async getAll(): Promise<any> {
    return await this.StoreService.findAll();
  }

  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Read, subject: Store })
  @Get(':id')
  async findByIdAdmin(@Param('id') id: number): Promise<any> {
    return await this.StoreService.find(id);
  }

  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Read, subject: Store })
  @Post('get')
  async findByEmailAndPass(@Body() updateStoreDto: updateStoreDto) {
    
    return await this.StoreService.validateStore(
      updateStoreDto.license,
      updateStoreDto.password,
    );
  }
  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Create, subject: Store })
  @Post('create')
  createAdmin(@Body() creatStoreDto: creatStoreDto): any {
    return this.StoreService.create(creatStoreDto);
  }

  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Update, subject: Store })
  @Put(':id')
  updateAdmin(@Param('id') id: number, @Body() updateStoreDto: updateStoreDto) {
    return this.StoreService.update(id, updateStoreDto);
  }

  @UseGuards(JwtAuthGaurd, AbilityGuard)
  @CheckAbility({ action: Action.Delete, subject: Store })
  @Delete(':id')
  deleteAdmin(@Param('id') id: number) {
    return this.StoreService.delete(id);
  }
}
