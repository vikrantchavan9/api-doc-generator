type Field = {
     path: string;
     type: string;
};

export function generateMarkdown(data: Field[]): string {
     let md = `### Parsed Fields\n\n| Path | Type |\n|------|------|\n`;

     for (const item of data) {
          md += `| \`${item.path}\` | \`${item.type}\` |\n`;
     }

     return md;
}
