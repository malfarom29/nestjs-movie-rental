export interface Mapper<D, E> {
  toDto(data: E | E[]): D | Promise<D> | Promise<D[]>;
}
