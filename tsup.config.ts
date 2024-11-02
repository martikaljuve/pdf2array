import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['cjs', 'esm'],
	target: ['node20', 'es2020'],
	clean: true,
	dts: true,
});
