import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
// import { NodeGlobal  sPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseUrl = mode == "production" ? env.PUBLIC_URL : "/";

  return {
    base: baseUrl,
    plugins: [react()],
    build: {
      outDir: "build",
      minify: true,
    },
    optimizeDeps: {
      include: ["xlsx", "file-saver"],
    },
    define: {
      "process.env.IS_PREACT": JSON.stringify("true"),
    },
  };
});
