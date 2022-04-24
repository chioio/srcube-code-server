export class PrismaHelper {
  
  static exclude<T, K extends keyof T>(model: T, ...keys: K[]): Omit<T, K> {
    for (let key of keys) {
      delete model[key];
    }
    return model;
  }
}
