import {
  NatureOperation,
  TypeMovement,
} from '@app/saas-component/helpers/enums';
import { Injectable } from '@nestjs/common';
import { isDefined } from 'class-validator';
import { Connection, Repository } from 'typeorm';
import { MovementEntity } from './movement.entity';
import { MovementModel } from './movement.model';
import { SubBankAccountEntity } from '../../../apps/bank-account/sub-account/sub-account.entity';
import { BankAccountEntity } from 'apps/ms-fin/src/apps/bank-account/bank-account.entity';

@Injectable()
export class MovementAccount {
  private bankRepository: Repository<BankAccountEntity>;
  private subBankRepository: Repository<SubBankAccountEntity>;
  private movementRepository: Repository<MovementEntity>;

  constructor() {}

  async add(
    connection: Connection,
    subAccount: SubBankAccountEntity[],
    user: string,
  ) {
    // Init repository
    this.movementRepository = connection.getRepository(MovementEntity);
    try {
      // Init default operation
      const result = [];
      for (const item of subAccount) {
        const movement = {
          sous_compte_banque_id: item.id,
          intitule: `Création du ${item.libelle}`,
          solde_en_date: 0,
          valeur: item.solde,
          nature: NatureOperation.nivellement,
          type: TypeMovement.credit,
          date: item.date,
        } as MovementModel;

        const res = await this.movementRepository.save({
          ...movement,
          created_by: user,
        });
        result.push(isDefined(res) ? true : false);
      }
      return result.length > 0 && result.every((val) => val === true)
        ? true
        : false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async treatment(
    connection: Connection,
    movement: MovementModel,
    user: string,
  ) {
    // Init repository
    this.movementRepository = connection.getRepository(MovementEntity);
    this.bankRepository = connection.getRepository(BankAccountEntity);
    this.subBankRepository = connection.getRepository(SubBankAccountEntity);
    try {
      // Init default operation
      const operation: number =
        movement.type == TypeMovement.debit
          ? +movement.valeur * -1
          : +movement.valeur;

      const resultAccount = await this.bankRepository.findOne(
        movement.compte_banque_id,
        { withDeleted: false },
      );
      const resultSubAccount = await this.subBankRepository.findOne(
        movement.sous_compte_banque_id,
        { withDeleted: false },
      );
      // balance to date init
      const soldeEnDate: number = +resultSubAccount.solde;
      // defalcated the bank account
      resultAccount.solde = +resultAccount.solde + operation;
      resultAccount.updated_by = user;
      // defalcated the sub bank account
      resultSubAccount.solde = +resultSubAccount.solde + operation;
      resultSubAccount.updated_by = user;

      // Updated account tables
      await this.bankRepository.update(
        { id: movement.compte_banque_id },
        resultAccount,
      );
      await this.subBankRepository.update(
        { id: movement.sous_compte_banque_id },
        resultSubAccount,
      );

      // set new movement
      const res = await this.movementRepository.save({
        ...movement,
        solde_en_date: soldeEnDate,
        created_by: user,
      });
      return isDefined(res) ? true : false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
