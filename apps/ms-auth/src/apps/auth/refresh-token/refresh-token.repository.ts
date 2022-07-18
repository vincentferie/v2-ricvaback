import { EntityRepository, Repository } from 'typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';
import { isDefined } from 'class-validator';
import { responseRequest } from '@app/saas-component/helpers/core';
import { RefreshTokensDto } from '@app/saas-component/helpers/dto';

@EntityRepository(RefreshTokenEntity)
export class RefreshTokenRepository extends Repository<RefreshTokenEntity> {
  async createRefreshToken(
    credentialsDto: RefreshTokensDto,
  ): Promise<RefreshTokenEntity> {
    const { user_id, is_revoked, expires, token } = credentialsDto;
    let exception;
    const refreshToken = new RefreshTokenEntity();

    refreshToken.user_id = user_id;
    refreshToken.is_revoked = is_revoked;
    refreshToken.expires = expires;
    refreshToken.token = token;

    try {
      return await refreshToken.save();
    } catch (error) {
      if (error.code === '23505') {
        // Duplucate
        exception = await responseRequest({
          status: 'errorInserted',
          data: null,
          params: error.detail,
        });
      } else if (error.code === '22001') {
        exception = await responseRequest({
          status: 'errorPayload',
          data: null,
          params: `${error.length} mots saisies excèdent la limite de taille autorisée.`,
        });
      } else {
        exception = await responseRequest({
          status: 'errorOtherRequest',
          data: null,
          params: error[0].constraints,
        });
      }

      return exception;
    }
  }

  async findTokenById(user: string): Promise<RefreshTokenEntity | null> {
    return RefreshTokenEntity.findOne({
      where: { user_id: user, is_revoked: false },
    });
  }

  async updateRefreshToken(credentialsDto: RefreshTokensDto) {
    const { id, is_revoked, token } = credentialsDto;
    let exception, found;
    try {
      found = await this.findOne({ id: id });
      if (isDefined(found)) {
        found.is_revoked = is_revoked;
        found.token = token;
        await found.save();
      }
    } catch (error) {
      if (error.code === '23505') {
        // Duplucate
        exception = await responseRequest({
          status: 'errorUpdated',
          data: null,
          params: error.detail,
        });
      } else if (error.code === '22001') {
        exception = await responseRequest({
          status: 'errorPayload',
          data: null,
          params: `${error.length} mots saisies excèdent la limite de taille autorisée.`,
        });
      } else {
        exception = await responseRequest({
          status: 'errorOtherRequest',
          data: null,
          params: error[0].constraints,
        });
      }

      return exception;
    }
  }
}
