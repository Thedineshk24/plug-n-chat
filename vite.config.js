export default defineConfig({
  plugins: [react(), wxt()],
  build: {
    rollupOptions: {
      input: {
        background: "./entrypoints/background.ts",
        content: "./entrypoints/content.ts",
      },
    },
  },
});
