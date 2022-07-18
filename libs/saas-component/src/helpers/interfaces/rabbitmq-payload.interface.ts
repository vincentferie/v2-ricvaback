export interface IRmqPayload<T, H> {
  payload: T;
  headers: H;
}
