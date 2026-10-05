import * as fs from 'fs';
import * as path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from '../src/swagger';

const outDir = path.resolve(process.cwd(), '.polaira');
const outFile = path.join(outDir, 'openapi.json');

const spec = swaggerJsdoc(swaggerOptions);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(spec, null, 2), 'utf-8');

console.log(`OpenAPI spec written to ${outFile}`);
