import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    let env = loadEnv(mode, process.cwd()),
        proxy = {};
        try {
            let o = JSON.parse(env.VITE_PROXY || '[]');
            o.map(i => {
                proxy[i.src] = i.target;
            });
        }catch(e){}

    return ({
        base: env.VITE_BASEDIR || '/',
        plugins: [
            react(),
            createHtmlPlugin({
                inject: {
                    data: {
                        title: 'vite 测试',
                    },
                },
            })
        ],
        server: {
            host: '0.0.0.0',
            port: 5713,
            proxy: {...proxy},
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
            }
        },
        define: {
            BASEDIR: JSON.stringify(env.VITE_BASEDIR),
        },
    });
});
