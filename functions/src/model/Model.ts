import { uuidv4 } from '@firebase/util';
import { WithId } from '../types';
import { database } from 'firebase-admin';
import { QueryFunction } from './queryFunctions';

export abstract class Model<T extends object> {
  prefixPath: string;
  private database: database.Database;

  constructor(prefixPath: string) {
    this.prefixPath = prefixPath;
    this.database = database();
  }

  private get dbRef() {
    return this.database.ref(this.path);
  }

  find(id: string) {
    return new Promise<T | null>(async (resolve, reject) => {
      this.dbRef
        .child(`/${id}`)
        .get()
        .then((snapshot) => {
          if (snapshot.exists()) {
            resolve(snapshot.val());
          } else {
            resolve(null);
          }
        })
        .catch(reject);
    });
  }

  findAll(queries: QueryFunction[]) {
    return new Promise<{ [key: string]: T } | null>((resolve, reject) => {
      const resultRef = queries.reduce<database.Query>((ref, fn) => fn(ref), this.dbRef);
      resultRef
        .get()
        .then((snapshot) => {
          if (snapshot.exists()) {
            resolve(snapshot.val());
          } else {
            resolve(null);
          }
        })
        .catch(reject);
    });
  }

  create(document: T) {
    const id = uuidv4();

    return new Promise<WithId<T>>((resolve, reject) => {
      this.dbRef
        .child(`/${id}`)
        .set({ ...document })
        .then(() => {
          resolve({ id, ...document });
        })
        .catch(reject);
    });
  }

  // delete(id: string) {
  //   return new Promise<boolean>((resolve, reject) => {
  //     this.dbRef
  //       .child(`/${id}`)
  //       .remove()
  //       .then(() => {
  //         resolve(true);
  //       })
  //       .catch(reject);
  //   });
  // }

  update(id: string, document: Partial<T>) {
    return new Promise<WithId<Partial<T>>>((resolve, reject) => {
      this.dbRef
        .child(`/${id}`)
        .update({ ...document })
        .then(() => {
          resolve({ id, ...document });
        })
        .catch(reject);
    });
  }

  /**
   * Model에서 realtime database에 접근하는 경로입니다.
   *
   * 반드시 설정해야합니다.
   */
  protected abstract get path(): string;
}
