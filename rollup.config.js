import buble from 'rollup-plugin-buble';
import fs from 'fs';
import resolve from 'rollup-plugin-node-resolve';

const pkg = JSON.parse(fs.readFileSync('./package.json'));

export default {
    input: 'index.js',
    external: [ 'mitt' ],
	plugins: [
        buble(),
        resolve()
    ],
	output: [
		{ 
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
            globals: {
                mitt: 'mitt'
            }
        },
		{ 
            file: pkg.module, 
            format: 'es',
            sourcemap: true,
            globals: {
                mitt: 'mitt'
            }
        },
		{ 
            file: pkg['umd:main'], 
            format: 'umd', 
            sourcemap: true,
            name: pkg.name,
            globals: {
                mitt: 'mitt'
            }
        }
    ]
};
