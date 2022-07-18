import { EntityRepository, Repository } from 'typeorm';
import { AccountEntity } from './account.entity';
import { UUIDVersion } from 'class-validator';
import { AuthCredentialsDto } from '@app/saas-component/helpers/dto';

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {
  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<UUIDVersion | null> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({
      where: { username: username },
      withDeleted: false,
    });

    if (user && (await user.validatePassword(password))) {
      return user.id;
    } else {
      return null;
    }
  }

  // private async hashPassword(password: string, salt: string): Promise<string> {
  //     return bcrypt.hash(password, salt);
  // }
}
