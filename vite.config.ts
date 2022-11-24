import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import typescript from "@rollup/plugin-typescript";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const plugins = [
    react(),
    typescript({
      target: "es5",
      rootDir: resolve("."),
      declaration: true,
      declarationDir: resolve("lib"),
      exclude: resolve("node_modules/**"),
      allowSyntheticDefaultImports: true,
    }),
  ];
  if (mode === "analyzer") {
    plugins.push(
      visualizer({
        open: true,
      })
    );
  }
  return {
    plugins,
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "ReactKeepalive",
        fileName: "react-keepalive",
        formats: ["cjs", "es", "umd"],
      },
      outDir: resolve(__dirname, "lib"),
      rollupOptions: {
        external: ["react", "react-dom", "react/jsx-runtime"],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
        },
      },
    },
  };
});
