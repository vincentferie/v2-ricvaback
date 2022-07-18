import { Injectable } from '@nestjs/common';
import { isDefined } from 'class-validator';
import { Connection, Repository } from 'typeorm';
import { AccountEntity } from '../../apps/externe/account.entity';

@Injectable()
export class VerifUser {
  private accountRepository: Repository<AccountEntity>;

  constructor() {}

  async checkExistingUser(connection: Connection, payload: any) {
    this.accountRepository = connection.getRepository(AccountEntity);
    try {
      const existing = await this.accountRepository.findOne({
        select: ['id'],
        where: {
          id: payload.id,
          role_id: payload.role,
        },
        withDeleted: false,
      });
      if (isDefined(existing)) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
}
