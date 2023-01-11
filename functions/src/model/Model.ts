import { uuidv4 } from "@firebase/util";
import {
  child,
  Database,
  DatabaseReference,
  get,
  getDatabase,
  ref,
  remove,
  set,
} from "firebase/database";

export abstract class Model<T> {
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

  findAll() {
    return new Promise<{ [key: string]: T } | null>((resolve, reject) => {
      get(child(this.dbRef, this.path))
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
    return new Promise<T>((resolve, reject) => {
      set(ref(this.database, `${this.path}/${uuidv4()}`), { ...document })
        .then(() => {
          resolve(document);
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

  /**
   * Model에서 realtime database에 접근하는 경로입니다.
   *
   * 반드시 설정해야합니다.
   */
  protected abstract get path(): string;
}
