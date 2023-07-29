import { uuidv4 } from '@firebase/util';
import {
  child,
  Database,
  DatabaseReference,
  get,
  getDatabase,
  ref,
  remove,
  set,
  query,
  QueryConstraint,
  update,
} from 'firebase/database';
import { WithId } from '../types';

export abstract class Model<T extends object> {
  prefixPath: string;
  private database: Database;
  private dbRef: DatabaseReference;

  constructor(prefixPath: string) {
    this.prefixPath = prefixPath;
    this.database = getDatabase();
    this.dbRef = ref(this.database);
  }

  find(id: string) {
    return new Promise<T | null>((resolve, reject) => {
      get(child(this.dbRef, `${this.path}/${id}`))
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

  findAll(...queryConstraints: QueryConstraint[]) {
    return new Promise<{ [key: string]: T } | null>((resolve, reject) => {
      get(query(child(this.dbRef, `${this.path}`), ...queryConstraints))
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
      set(ref(this.database, `${this.path}/${id}`), { ...document })
        .then(() => {
          resolve({ id, ...document });
        })
        .catch(reject);
    });
  }

  delete(id: string) {
    return new Promise((resolve, reject) => {
      remove(ref(this.database, `${this.path}/${id}`))
        .then(() => {
          resolve(true);
        })
        .catch(reject);
    });
  }
  
  update(id: string, document: Partial<T>) {
    return new Promise<WithId<Partial<T>>>((resolve, reject) => {
      update(ref(this.database, `${this.path}/${id}`), { ...document })
        .then(() => resolve({ id, ...document }))
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
