// vitest.config.ts
import { defineConfig as defineConfig2 } from "file:///C:/Users/johka96/kod/anti/node_modules/vitest/dist/config.js";
import { mergeConfig } from "file:///C:/Users/johka96/kod/anti/node_modules/vite/dist/node/index.js";

// vite.config.ts
import { defineConfig } from "file:///C:/Users/johka96/kod/anti/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/johka96/kod/anti/node_modules/@vitejs/plugin-react/dist/index.js";
import { VitePWA } from "file:///C:/Users/johka96/kod/anti/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  base: "/anti/",
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg", "favicon.png"],
      manifest: {
        name: "Anti List",
        short_name: "Anti List",
        description: "A progressive list management app",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 1300
  },
  // @ts-expect-error: Vitest types definition
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    // Här konfigurerar vi specifika filer för specifika reporters
    reporters: ["default", "vitest-sonar-reporter"],
    outputFile: {
      "vitest-sonar-reporter": "dist/sonar-report.xml",
      // Denna behövs för Sonar
      "junit": "dist/test-results.xml"
      // Om du även vill ha JUnit (valfritt)
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"]
    }
  }
});

// vitest.config.ts
var vitest_config_default = mergeConfig(vite_config_default, defineConfig2({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests.ts"
  }
}));
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyIsICJ2aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGpvaGthOTZcXFxca29kXFxcXGFudGlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGpvaGthOTZcXFxca29kXFxcXGFudGlcXFxcdml0ZXN0LmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvam9oa2E5Ni9rb2QvYW50aS92aXRlc3QuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZydcclxuaW1wb3J0IHsgbWVyZ2VDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdml0ZUNvbmZpZyBmcm9tICcuL3ZpdGUuY29uZmlnJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWVyZ2VDb25maWcodml0ZUNvbmZpZywgZGVmaW5lQ29uZmlnKHtcclxuICB0ZXN0OiB7XHJcbiAgICBnbG9iYWxzOiB0cnVlLFxyXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXHJcbiAgICBzZXR1cEZpbGVzOiAnc3JjL3NldHVwVGVzdHMudHMnLFxyXG4gIH0sXHJcbn0pKVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGpvaGthOTZcXFxca29kXFxcXGFudGlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGpvaGthOTZcXFxca29kXFxcXGFudGlcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2pvaGthOTYva29kL2FudGkvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSdcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgYmFzZTogJy9hbnRpLycsXHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIFZpdGVQV0Eoe1xyXG4gICAgICByZWdpc3RlclR5cGU6ICdwcm9tcHQnLFxyXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbJ2Zhdmljb24uaWNvJywgJ2FwcGxlLXRvdWNoLWljb24ucG5nJywgJ21hc2tlZC1pY29uLnN2ZycsICdmYXZpY29uLnBuZyddLFxyXG4gICAgICBtYW5pZmVzdDoge1xyXG4gICAgICAgIG5hbWU6ICdBbnRpIExpc3QnLFxyXG4gICAgICAgIHNob3J0X25hbWU6ICdBbnRpIExpc3QnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQSBwcm9ncmVzc2l2ZSBsaXN0IG1hbmFnZW1lbnQgYXBwJyxcclxuICAgICAgICB0aGVtZV9jb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgIGljb25zOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogJ3B3YS0xOTJ4MTkyLnBuZycsXHJcbiAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXHJcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6ICdwd2EtNTEyeDUxMi5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICBdLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEzMDAsXHJcbiAgfSxcclxuICAvLyBAdHMtZXhwZWN0LWVycm9yOiBWaXRlc3QgdHlwZXMgZGVmaW5pdGlvblxyXG4gIHRlc3Q6IHtcclxuICAgIGdsb2JhbHM6IHRydWUsXHJcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcclxuICAgIHNldHVwRmlsZXM6ICcuL3NyYy9zZXR1cFRlc3RzLnRzJyxcclxuICAgIC8vIEhcdTAwRTRyIGtvbmZpZ3VyZXJhciB2aSBzcGVjaWZpa2EgZmlsZXIgZlx1MDBGNnIgc3BlY2lmaWthIHJlcG9ydGVyc1xyXG4gICAgcmVwb3J0ZXJzOiBbJ2RlZmF1bHQnLCAndml0ZXN0LXNvbmFyLXJlcG9ydGVyJ10sXHJcbiAgICBvdXRwdXRGaWxlOiB7XHJcbiAgICAgICd2aXRlc3Qtc29uYXItcmVwb3J0ZXInOiAnZGlzdC9zb25hci1yZXBvcnQueG1sJywgLy8gRGVubmEgYmVoXHUwMEY2dnMgZlx1MDBGNnIgU29uYXJcclxuICAgICAgJ2p1bml0JzogJ2Rpc3QvdGVzdC1yZXN1bHRzLnhtbCcgLy8gT20gZHUgXHUwMEU0dmVuIHZpbGwgaGEgSlVuaXQgKHZhbGZyaXR0KVxyXG4gICAgfSxcclxuICAgIGNvdmVyYWdlOiB7XHJcbiAgICAgIHByb3ZpZGVyOiAndjgnLFxyXG4gICAgICByZXBvcnRlcjogWyd0ZXh0JywgJ2pzb24nLCAnaHRtbCcsICdsY292J10sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pXHJcblxyXG5cclxuXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlEsU0FBUyxnQkFBQUEscUJBQW9CO0FBQ3hTLFNBQVMsbUJBQW1COzs7QUNBNUIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUd4QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUEsTUFDZCxlQUFlLENBQUMsZUFBZSx3QkFBd0IsbUJBQW1CLGFBQWE7QUFBQSxNQUN2RixVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsUUFDYixPQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsdUJBQXVCO0FBQUEsRUFDekI7QUFBQTtBQUFBLEVBRUEsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWTtBQUFBO0FBQUEsSUFFWixXQUFXLENBQUMsV0FBVyx1QkFBdUI7QUFBQSxJQUM5QyxZQUFZO0FBQUEsTUFDVix5QkFBeUI7QUFBQTtBQUFBLE1BQ3pCLFNBQVM7QUFBQTtBQUFBLElBQ1g7QUFBQSxJQUNBLFVBQVU7QUFBQSxNQUNSLFVBQVU7QUFBQSxNQUNWLFVBQVUsQ0FBQyxRQUFRLFFBQVEsUUFBUSxNQUFNO0FBQUEsSUFDM0M7QUFBQSxFQUNGO0FBQ0YsQ0FBQzs7O0FEaERELElBQU8sd0JBQVEsWUFBWSxxQkFBWUMsY0FBYTtBQUFBLEVBQ2xELE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFlBQVk7QUFBQSxFQUNkO0FBQ0YsQ0FBQyxDQUFDOyIsCiAgIm5hbWVzIjogWyJkZWZpbmVDb25maWciLCAiZGVmaW5lQ29uZmlnIl0KfQo=
