import { ResultItem } from '@/types/api';

export function flattenJSON(obj: unknown, parentPath = ''): ResultItem[] {
     const result: ResultItem[] = [];

     if (typeof obj !== 'object' || obj === null) {
          console.warn("flattenJSON received a non-object input:", obj);
          return [];
     }

     const iterableObj = obj as Record<string, unknown>;

     for (const key in iterableObj) {
          if (Object.prototype.hasOwnProperty.call(iterableObj, key)) {
               const value = iterableObj[key];
               const path = parentPath ? `${parentPath}.${key}` : key;

               if (value === null) {
                    result.push({ path, type: 'null', description: '' });
               } else if (Array.isArray(value)) {
                    result.push({ path, type: 'array', description: '' });
                    if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
                         result.push(...flattenJSON(value[0], `${path}[0]`));
                    }
               } else if (typeof value === 'object') {
                    if (value !== null) {
                         result.push(...flattenJSON(value, path));
                    } else {
                         result.push({ path, type: 'null', description: '' });
                    }
               } else {
                    result.push({ path, type: typeof value, description: '' });
               }
          }
     }

     return result;
}