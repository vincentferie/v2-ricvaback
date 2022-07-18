import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { isNotEmpty } from 'class-validator';

export function getOptions(
  queue: string,
  config: ConfigService | null,
  supOption: any,
): RmqOptions {
  let url: string,
    protocole: string,
    credential: string,
    domain: string,
    host: string;

  if (isNotEmpty(config)) {
    protocole = `${config.get('rmqType')}://`;
    credential = `${config.get('rmqUser')}:${config.get('rmqPass')}`;
    domain = `${config.get('rmqHost')}:${config.get('rmqPort')}`;
    host = config.get('rmqVHost');
  } else {
    protocole = `${process.env.RMQ_TYPE}://`;
    credential = `${process.env.RMQ_USER}:${process.env.RMQ_PASS}`;
    domain = `${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`;
    host = process.env.RMQ_VHOST;
  }
  if (credential != ':') {
    url = protocole.concat(credential, '@', domain, '/', host);
  } else {
    url = protocole.concat(domain, '/', host);
  }

  return {
    transport: Transport.RMQ,
    options: {
      urls: [url],
      // urls: [
      //   'amqps://dtwmwkqx:uSFP5jrjrnNDdDT746HULmhczwIixuBm@rat.rmq2.cloudamqp.com/dtwmwkqx',
      // ],
      queue: `${queue.toLowerCase()}-queue`,
      queueOptions: {
        durable: true,
        arguments: {
          'x-queue-type': 'classic',
          'x-queue-version': 2,
        },
      },
      noAck: true,
      persistent: true,
      ...supOption,
    },
  };
}
// NestJS handles acknowledgments manual.
export function ack(context: RmqContext) {
  const channel = context.getChannelRef();
  const originalMessage = context.getMessage();
  channel.ack(originalMessage);
}
