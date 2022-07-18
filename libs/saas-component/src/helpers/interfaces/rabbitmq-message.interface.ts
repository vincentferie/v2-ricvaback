export interface IRmqMessage<T> {
  pattern: { cmd: string };
  data: T;
  context: { args: [string] };
}
