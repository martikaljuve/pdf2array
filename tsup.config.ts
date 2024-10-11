import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	clean: true,
	format: ['cjs', 'esm'],
	target: ['node22', 'es2020'],
	dts: true,
});
