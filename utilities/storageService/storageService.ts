import { z } from 'zod';

export type StorageService = {
  getItem: <T extends z.ZodTypeAny>(key: string, schema: T) => z.infer<T> | undefined;
  removeItem: (key: string) => void;
  setItem: <T>(key: string, payload: T) => void;
};

export function StorageService(storage: Storage): StorageService {
  const removeItem = (key: string) => {
    storage.removeItem(key);
  };

  return {
    getItem: (key, schema) => {
      const itemFromStorage = storage.getItem(key);

      if (!itemFromStorage) return;

      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return schema.parse(itemFromStorage) as z.infer<typeof schema>;
      } catch {
        // clear persisted data if it not complies with provided schema
        removeItem(key);

        return;
      }
    },

    removeItem,

    setItem: (key, payload) => {
      storage.setItem(key, JSON.stringify(payload));
    },
  };
}
