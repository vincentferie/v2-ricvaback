import { Module } from '@nestjs/common';
import { VerifUser } from '../../helpers/services/verif-user.service';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [],
  controllers: [BookingController],
  providers: [BookingService, VerifUser],
})
export class BookingModule {}
