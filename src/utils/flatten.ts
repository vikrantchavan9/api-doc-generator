type Result = { path: string; type: string; description: string };

export function flattenJSON(obj: any, parentPath = ''): Result[] {
     const result: Result[] = [];

     for (const key in obj) {
          const value = obj[key];
          const path = parentPath ? `${parentPath}.${key}` : key;

          if (value === null) {
               result.push({ path, type: 'null', description: '' });
          } else if (Array.isArray(value)) {
               result.push({ path, type: 'array', description: '' });
               if (value.length > 0 && typeof value[0] === 'object') {
                    result.push(...flattenJSON(value[0], `${path}[0]`));
               }
          } else if (typeof value === 'object') {
               result.push(...flattenJSON(value, path));
          } else {
               result.push({ path, type: typeof value, description: '' });
          }
     }

     return result;
}
