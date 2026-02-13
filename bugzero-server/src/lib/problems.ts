import fs from 'fs/promises';
import path from 'path';

export interface Problem {
  id: string;
  lang: string;
  code: string;
  level: string;
  testcases: { input: string; output: string }[];
}

export async function getAllProblems(): Promise<Problem[]> {
  const problemsPath = path.join(process.cwd(), 'problems');
  try {
    const dirs = await fs.readdir(problemsPath);
    const problems: Problem[] = [];

    for (const dir of dirs) {
      const dirPath = path.join(problemsPath, dir);
      try {
        const stat = await fs.stat(dirPath);

        if (stat.isDirectory()) {
          const metaPath = path.join(dirPath, 'meta.json');
          const metaContent = await fs.readFile(metaPath, 'utf-8');
          const meta = JSON.parse(metaContent);

          const lang = meta.lang;
          const codePath = path.join(dirPath, `code.${lang}`);
          const code = await fs.readFile(codePath, 'utf-8');

          problems.push({
            id: dir,
            lang,
            code,
            level: meta.level || 'easy',
            testcases: meta.testcases || []
          });
        }
      } catch (err) {
        console.warn(`Problem directory ${dir} skipped due to error:`, err);
      }
    }

    return problems;
  } catch (error) {
    console.error('Error reading problems directory:', error);
    return [];
  }
}