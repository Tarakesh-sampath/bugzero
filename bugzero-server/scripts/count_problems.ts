import fs from 'fs';
import path from 'path';

const problemsDir = './problems';
interface Stats {
    [key: string]: { [key: string]: number };
}

const stats: Stats = {
    java: { easy: 0, medium: 0, hard: 0 },
    py: { easy: 0, medium: 0, hard: 0 },
    c: { easy: 0, medium: 0, hard: 0 }
};

const dirs = fs.readdirSync(problemsDir);

dirs.forEach(dir => {
    const metaPath = path.join(problemsDir, dir, 'meta.json');
    if (fs.existsSync(metaPath)) {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
        const lang = (meta.lang || '').toLowerCase();
        const level = (meta.level || 'easy').toLowerCase();

        if (stats[lang]) {
            stats[lang][level] = (stats[lang][level] || 0) + 1;
        }
    }
});

console.log(JSON.stringify(stats, null, 2));
