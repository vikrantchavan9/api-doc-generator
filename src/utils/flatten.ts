type Result = { path: string; type: string };

export function flattenJSON(obj: any, parentPath = ''): Result[] {
     const result: Result[] = [];

     for (const key in obj) {
          const value = obj[key];
          const path = parentPath ? `${parentPath}.${key}` : key;

          if (value === null) {
               result.push({ path, type: 'null' });
          } else if (Array.isArray(value)) {
               result.push({ path, type: 'array' });
               if (value.length > 0 && typeof value[0] === 'object') {
                    // Recurse into first object of the array
                    result.push(...flattenJSON(value[0], `${path}[0]`));
               }
          } else if (typeof value === 'object') {
               result.push(...flattenJSON(value, path));
          } else {
               result.push({ path, type: typeof value });
          }
     }

     return result;
}
