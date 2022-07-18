import { Module } from '@nestjs/common';
import { SitesController } from './site.controller';

@Module({
  controllers: [SitesController],
  providers: [],
})
export class SiteModule {}
