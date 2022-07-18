import { EntityRepository, Repository } from 'typeorm';
import { AccountEntity } from './account.entity';
import * as bcrypt from 'bcrypt';
import { UUIDVersion } from 'class-validator';
import { AuthCredentialsDto } from '@app/saas-component/helpers/dto';

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {
  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<UUIDVersion | null> {
    const { username, password } = authCredentialsDto;

    const result = await this.findOne({ username });
    if (result && (await result.validatePassword(password))) {
      return result.id;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
