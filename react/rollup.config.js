import resolve from '@rollup/plugin-node-resolve';
import scss from 'rollup-plugin-scss';
import json from 'rollup-plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import {terser } from 'rollup-plugin-terser';
import external from 'rollup-plugin-peer-deps-external';

const packageJson = require('./package.json');

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file:'dist/bundle.js',
                format: 'umd',
                sourcemap: true,
                name: 'progress-up'
            },
            {
                file: 'dist/bundle.js',
                format: 'esm',
                sourcemap: true
            }
        ],
        plugins: [
            external(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.json' }),
            terser(),
	    scss(),
	    json()
        ],
    },
]
