export function generateMarkdown(data: { path: string; type: string; description: string }[]): string {
     let md = `### Parsed Fields\n\n| Path | Type | Description |\n|------|------|-------------|\n`;

     for (const item of data) {
          md += `| \`${item.path}\` | \`${item.type}\` | ${item.description || ''} |\n`;
     }

     return md;
}
