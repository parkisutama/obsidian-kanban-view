import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            // Map bare "obsidian" imports to our manual mock
            obsidian: path.resolve(__dirname, 'tests/__mocks__/obsidian.ts'),
            // Honour the same "src/" alias that tsconfig uses
            src: path.resolve(__dirname, 'src'),
            // Allow test-internal helpers to be imported as "tests/..."
            tests: path.resolve(__dirname, 'tests'),
        },
    },
    test: {
        globals: true,
        // jsdom provides window / localStorage that src/lang/helpers.ts reads at
        // module-load time, preventing "window is not defined" errors.
        environment: 'jsdom',
        setupFiles: ['tests/setup.ts'],
        include: ['tests/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            include: ['src/parsers/**'],
        },
    },
});
