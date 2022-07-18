/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { isDefined } from 'class-validator';
import {
  Not,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Equal,
  ILike,
  Between,
  In,
  IsNull,
  Raw,
  RelationId,
} from 'typeorm';

export const TypeOrmHttpParamQuery = (paramQuery: any) => {
  let typeOrmQuery: any = null;
  if (typeof paramQuery == 'object') {
    typeOrmQuery = {};
    for (const property in paramQuery) {
      if (isDefined(paramQuery[property]._type)) {
        switch (paramQuery[property]._type) {
          case 'not': {
            typeOrmQuery[property] = Not(paramQuery[property]._value);
            break;
          }
          case 'lessThan': {
            typeOrmQuery[property] = LessThan(paramQuery[property]._value);
            break;
          }
          case 'lessThanOrEqual': {
            typeOrmQuery[property] = LessThanOrEqual(
              paramQuery[property]._value,
            );
            break;
          }
          case 'moreThan': {
            typeOrmQuery[property] = MoreThan(paramQuery[property]._value);
            break;
          }
          case 'moreThanOrEqual': {
            typeOrmQuery[property] = MoreThanOrEqual(
              paramQuery[property]._value,
            );
            break;
          }
          case 'equal': {
            typeOrmQuery[property] = Equal(paramQuery[property]._value);
            break;
          }
          case 'like': {
            typeOrmQuery[property] = ILike(`%${paramQuery[property]._value}%`);
            break;
          }
          case 'between': {
            const [a, b] = paramQuery[property]._value;
            typeOrmQuery[property] = Between(a, b);
            break;
          }
          case 'in': {
            typeOrmQuery[property] = In(paramQuery[property]._value);
            break;
          }
          case 'isNull': {
            typeOrmQuery[property] = IsNull();
            break;
          }
          case 'raw': {
            typeOrmQuery[property] = Raw(paramQuery[property]._value);
            break;
          }
          case 'relations': {
            typeOrmQuery[property] = RelationId(paramQuery[property]._value);
            break;
          }
          default:
            break;
        }
      } else {
        if (!Array.isArray(paramQuery[property])) {
          typeOrmQuery[property] = paramQuery[property];
        } else {
          typeOrmQuery[property] = [];
          paramQuery[property].forEach((element) => {
            typeOrmQuery[property].push(TypeOrmHttpParamQuery(element));
          });
        }
      }
    }
  } else {
    typeOrmQuery = paramQuery;
  }
  return typeOrmQuery;
};
