import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true,
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { useESM: true }],
	},
};

export default config;
