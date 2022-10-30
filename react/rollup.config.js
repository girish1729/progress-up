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
        input: 'src/index.js',
        output: [
             {
                file:'dist/iife/bundle.js',
                format: 'iife',
                sourcemap: true,
                name: 'progressUp'
            },
	    {
                file:'dist/umd/bundle.js',
                format: 'umd',
                sourcemap: true,
                name: 'progressUp'
            },

           {
                file: 'dist/esm/bundle.js',
                format: 'esm',
                sourcemap: true,
		name: 'progressUp'
            }
        ],
        plugins: [
            external(),
            resolve(),
            commonjs(),
            //typescript({ tsconfig: './tsconfig.json' }),
            terser(),
	    scss(),
	    json()
        ],
    },
]
