import {AuthGuard} from '@nestjs/passport'
export class RefreshJwtAuthGaurd extends AuthGuard('refresh-jwt'){}