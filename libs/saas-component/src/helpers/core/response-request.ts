import { HttpStatus } from '@nestjs/common';
import { isEmpty } from 'class-validator';

export const responseRequest = async (paramResponse: ParamResponse) => {
  let response: any;
  let stateTab = 0;

  if (Object.keys(paramResponse).length > 0) {
    switch (paramResponse.status) {
      case 'found':
        {
          response = {
            response: {
              state: HttpStatus.ACCEPTED,
              message: Array.isArray(paramResponse.data)
                ? paramResponse.data.length + ' trouvé(s)'
                : paramResponse.params + ' trouvé(s)',
              data: paramResponse.data,
            },
          };
          stateTab = HttpStatus.ACCEPTED;
        }
        break;
      case 'errorFound':
        {
          response = {
            response: {
              state: HttpStatus.NOT_FOUND,
              message: !isEmpty(paramResponse.params)
                ? paramResponse.params
                : `Aucun résultat trouvé!`,
              data: paramResponse.data,
            },
          };
          stateTab = HttpStatus.NOT_FOUND;
        }
        break;
      case 'inserted':
        {
          response = {
            response: {
              state: HttpStatus.CREATED,
              message: 'Insertion éffectué avec succès!',
              data: paramResponse.data,
            },
          };
          stateTab = HttpStatus.CREATED;
        }
        break;
      case 'errorInserted':
        {
          response = {
            response: {
              state: HttpStatus.CONFLICT,
              message: !isEmpty(paramResponse.params)
                ? paramResponse.params
                : `L'insertion à échouer!`,
              data: paramResponse.data,
            },
          };
          stateTab = HttpStatus.CONFLICT;
        }
        break;
      case 'updated':
        {
          response = {
            response: {
              state: HttpStatus.ACCEPTED,
              message: `Les données ont été mise à jour!`,
              data: paramResponse.data,
            },
          };
          stateTab = HttpStatus.ACCEPTED;
        }
        break;
      case 'errorUpdated':
        {
          response = {
            response: {
              state: HttpStatus.NOT_ACCEPTABLE,
              message:
                Object.keys(paramResponse.params).length > 0
                  ? paramResponse.params
                  : `La mise à jour à échouer!`,
              data: paramResponse.data,
            },
          };
          stateTab = HttpStatus.NOT_ACCEPTABLE;
        }
        break;
      case 'deleted':
        {
          response = {
            response: {
              state: HttpStatus.ACCEPTED,
              message: `Les données ont été supprimé avec succès!`,
              data: paramResponse.data,
            },
          };
          stateTab = HttpStatus.ACCEPTED;
        }
        break;
      case 'errorDeleted':
        {
          response = {
            response: {
              state: HttpStatus.NOT_ACCEPTABLE,
              message:
                Object.keys(paramResponse.params).length > 0
                  ? paramResponse.params
                  : `La suppression à échouer!`,
              data: paramResponse.data,
            },
          };
          stateTab = HttpStatus.NOT_ACCEPTABLE;
        }
        break;
      case 'errorRequest':
        {
          response = {
            response: {
              state: HttpStatus.BAD_REQUEST,
              message:
                paramResponse.params ??
                `Les paramètres de la requêtes ne sont pas acceptés!`,
              data: paramResponse.data,
            },
          };
          stateTab = HttpStatus.BAD_REQUEST;
        }
        break;
      case 'errorPayload':
        {
          response = {
            response: {
              state: HttpStatus.PAYLOAD_TOO_LARGE,
              message:
                paramResponse.params ??
                `La taille de la payload est supérieur à celle definie!`,
              data: paramResponse.data,
            },
          };
          stateTab = HttpStatus.PAYLOAD_TOO_LARGE;
        }
        break;
      case 'errorOtherRequest':
        {
          response = {
            response: {
              state: HttpStatus.INTERNAL_SERVER_ERROR,
              message:
                paramResponse.params ??
                `Une erreur interne est survenue, Verifier les logs!`,
              data: paramResponse.data,
            },
          };
          stateTab = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        break;
      case 'authenticate':
        {
          response = {
            response: {
              state: HttpStatus.ACCEPTED,
              message: 'Authentification reussie!',
              data: paramResponse.data,
            },
          };
          stateTab = HttpStatus.ACCEPTED;
        }
        break;
      case 'unAutorized':
        {
          response = {
            response: {
              state: HttpStatus.UNAUTHORIZED,
              message:
                paramResponse.params ??
                `Vous n'avez pas d'autorisation valide!`,
              data: paramResponse.data,
            },
          };
          stateTab = HttpStatus.UNAUTHORIZED;
        }
        break;
      case 'timeout':
        {
          response = {
            response: {
              state: HttpStatus.REQUEST_TIMEOUT,
              message:
                paramResponse.params ??
                `Le temps d'exécution de la requête est échue!`,
              data: paramResponse.data,
            },
          };
          stateTab = HttpStatus.REQUEST_TIMEOUT;
        }
        break;
      case 'gatewayTimeout':
        {
          response = {
            response: {
              state: HttpStatus.GATEWAY_TIMEOUT,
              message:
                paramResponse.params ??
                `La Gateway n'a pas obtenu de réponse à temps!`,
              data: paramResponse.data,
            },
          };
          stateTab = HttpStatus.GATEWAY_TIMEOUT;
        }
        break;

      default:
        {
          response = {
            response: {
              state: HttpStatus.OK,
              message: paramResponse.params,
              data: paramResponse.data,
            },
          };
          stateTab = HttpStatus.OK;
        }
        break;
    }
  }

  return [response, stateTab];
};

export interface ParamResponse {
  status: string;
  params: any;
  data: any;
}
