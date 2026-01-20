# Validation Output (2026-01-20T09:18:43.262Z)

```bash

> anti@9.0.0 build:only
> tsc -b && vite build

[36mvite v7.3.1 [32mbuilding client environment for production...[36m[39m
transforming...
[32m✓[39m 2454 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mmanifest.webmanifest                        [39m[1m[2m    0.36 kB[22m[1m[22m
[2mdist/[22m[32mindex.html                                  [39m[1m[2m    0.52 kB[22m[1m[22m[2m │ gzip:   0.31 kB[22m
[2mdist/[22m[35massets/index-DpuF8sB4.css                   [39m[1m[2m   47.50 kB[22m[1m[22m[2m │ gzip:   7.89 kB[22m
[2mdist/[22m[36massets/workbox-window.prod.es5-BIl4cyR9.js  [39m[1m[2m    5.76 kB[22m[1m[22m[2m │ gzip:   2.37 kB[22m
[2mdist/[22m[36massets/index-DaHdUq0v.js                    [39m[1m[2m1,292.94 kB[22m[1m[22m[2m │ gzip: 390.83 kB[22m
[32m✓ built in 8.86s[39m

PWA v1.2.0
mode      generateSW
precache  8 entries (1315.15 KiB)
files generated
  dist/sw.js
  dist/workbox-19bcba7d.js

> anti@9.0.0 lint
> eslint .


> anti@9.0.0 check-any
> eslint . --config eslint.strict.config.ts


> anti@9.0.0 test
> vitest run --coverage


[1m[46m RUN [49m[22m [36mv4.0.16 [39m[90mC:/kod/anti[39m
      [2mCoverage enabled with [22m[33mv8[39m

[90mstderr[2m | src/hooks/useFirestoreSync.test.ts[2m > [22m[2museFirestoreSync[2m > [22m[2mshould handle snapshot errors
[22m[39mFirestore sync error for users/test-user-id/test-collection: Error: Firestore error
    at C:/kod/anti/src/hooks/useFirestoreSync.test.ts:89:27
    at [90mfile:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:145:11
    at [90mfile:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:915:26
    at [90mfile:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at [90mfile:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:1653:37
    at Traces.$ [90m(file:///C:/kod/anti/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.U4xDYhzZ.js:115:27[90m)[39m
    at trace [90m(file:///C:/kod/anti/[39mnode_modules/[4mvitest[24m/dist/chunks/test.B8ej_ZHS.js:239:21[90m)[39m
    at runTest [90m(file:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:1653:12[90m)[39m

[90mstderr[2m | src/hooks/useFirestoreSync.test.ts[2m > [22m[2museFirestoreSync[2m > [22m[2mshould add item successfully
[22m[39mFirestore sync error for users/test-user-id/test-collection: Error: Firestore error
    at C:/kod/anti/src/hooks/useFirestoreSync.test.ts:89:27
    at [90mfile:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:145:11
    at [90mfile:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:915:26
    at [90mfile:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at [90mfile:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:1653:37
    at Traces.$ [90m(file:///C:/kod/anti/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.U4xDYhzZ.js:115:27[90m)[39m
    at trace [90m(file:///C:/kod/anti/[39mnode_modules/[4mvitest[24m/dist/chunks/test.B8ej_ZHS.js:239:21[90m)[39m
    at runTest [90m(file:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:1653:12[90m)[39m

[90mstderr[2m | src/hooks/useFirestoreSync.test.ts[2m > [22m[2museFirestoreSync[2m > [22m[2mshould update item successfully
[22m[39mFirestore sync error for users/test-user-id/test-collection: Error: Firestore error
    at C:/kod/anti/src/hooks/useFirestoreSync.test.ts:89:27
    at [90mfile:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:145:11
    at [90mfile:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:915:26
    at [90mfile:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at [90mfile:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:1653:37
    at Traces.$ [90m(file:///C:/kod/anti/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.U4xDYhzZ.js:115:27[90m)[39m
    at trace [90m(file:///C:/kod/anti/[39mnode_modules/[4mvitest[24m/dist/chunks/test.B8ej_ZHS.js:239:21[90m)[39m
    at runTest [90m(file:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:1653:12[90m)[39m

[90mstderr[2m | src/hooks/useFirestoreSync.test.ts[2m > [22m[2museFirestoreSync[2m > [22m[2mshould delete item successfully
[22m[39mFirestore sync error for users/test-user-id/test-collection: Error: Firestore error
    at C:/kod/anti/src/hooks/useFirestoreSync.test.ts:89:27
    at [90mfile:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:145:11
    at [90mfile:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:915:26
    at [90mfile:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at [90mfile:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:1653:37
    at Traces.$ [90m(file:///C:/kod/anti/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.U4xDYhzZ.js:115:27[90m)[39m
    at trace [90m(file:///C:/kod/anti/[39mnode_modules/[4mvitest[24m/dist/chunks/test.B8ej_ZHS.js:239:21[90m)[39m
    at runTest [90m(file:///C:/kod/anti/[39mnode_modules/[4m@vitest/runner[24m/dist/index.js:1653:12[90m)[39m

 [32m✓[39m src/hooks/useFirestoreSync.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 102[2mms[22m[39m
 [32m✓[39m src/components/SearchResults.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[32m 98[2mms[22m[39m
 [32m✓[39m src/components/CombinationEditor.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[32m 253[2mms[22m[39m
[90mstderr[2m | src/components/SessionDetail.test.tsx[2m > [22m[2mSessionDetail[2m > [22m[2mcompletes session
[22m[39mNo routes matched location "/category/cat1" 

 [32m✓[39m src/components/SessionDetail.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[33m 334[2mms[22m[39m
 [32m✓[39m src/components/CategoryView.test.tsx [2m([22m[2m4 tests[22m[2m)[22m[32m 143[2mms[22m[39m
 [32m✓[39m src/context/AuthContext.test.tsx [2m([22m[2m4 tests[22m[2m)[22m[32m 83[2mms[22m[39m
[90mstderr[2m | src/context/ToastContext.test.tsx[2m > [22m[2mToastContext[2m > [22m[2mshowToast adds a toast
[22m[39mAn update to ToastProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

[90mstderr[2m | src/context/ToastContext.test.tsx[2m > [22m[2mToastContext[2m > [22m[2mremoveToast removes a toast by id
[22m[39mAn update to ToastProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

 [32m✓[39m src/context/ToastContext.test.tsx [2m([22m[2m3 tests[22m[2m)[22m[32m 69[2mms[22m[39m
 [32m✓[39m src/components/Modal.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[32m 237[2mms[22m[39m
 [32m✓[39m src/components/SessionPicker.test.tsx [2m([22m[2m4 tests[22m[2m)[22m[32m 196[2mms[22m[39m
[90mstderr[2m | src/components/ListDetail.test.tsx[2m > [22m[2mListDetail[2m > [22m[2madds a new item
[22m[39mAn update to ListDetail inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

 [32m✓[39m src/context/AppContext.test.tsx [2m([22m[2m9 tests[22m[2m)[22m[32m 75[2mms[22m[39m
[90mstderr[2m | src/components/ListDetail.test.tsx[2m > [22m[2mListDetail[2m > [22m[2mtoggles item completion
[22m[39mAn update to ListDetail inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

 [32m✓[39m src/components/ListDetail.test.tsx [2m([22m[2m4 tests[22m[2m)[22m[32m 162[2mms[22m[39m

[2m Test Files [22m [1m[32m11 passed[39m[22m[90m (11)[39m
[2m      Tests [22m [1m[32m60 passed[39m[22m[90m (60)[39m
[2m   Start at [22m 10:19:06
[2m   Duration [22m 4.02s[2m (transform 2.05s, setup 4.62s, import 6.38s, tests 1.75s, environment 20.55s)[22m

JUNIT report written to C:/kod/anti/dist/test-results.xml
[34m % [39m[2mCoverage report from [22m[33mv8[39m
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   54.64 |    43.52 |   48.67 |   55.78 |                   
 src               |     100 |      100 |     100 |     100 |                   
  firebase.ts      |     100 |      100 |     100 |     100 |                   
 src/components    |   54.26 |    46.74 |   49.51 |   55.67 |                   
  CategoryView.tsx |   34.69 |       25 |   26.66 |   37.07 | ...98-272,295-387 
  ...ionEditor.tsx |   93.18 |    77.14 |   94.44 |    92.3 | 33-34,54          
  ...rBoundary.tsx |   31.25 |    16.66 |   42.85 |   31.25 | 22-30,35-40,48-80 
  ListDetail.tsx   |   41.63 |    32.85 |   29.41 |   44.24 | ...57-698,715-944 
  Modal.tsx        |    91.3 |    88.23 |   85.71 |   90.47 | 35-36             
  ...chResults.tsx |   88.23 |    93.33 |   81.81 |    87.5 | 32,51             
  ...ionDetail.tsx |   82.14 |    67.44 |   94.11 |      80 | 52-63,86,214      
  ...ionPicker.tsx |   82.35 |       75 |   83.33 |   84.78 | 41,81-85,144      
 src/context       |   57.03 |    28.75 |    44.3 |   58.62 |                   
  AppContext.tsx   |   50.94 |    25.67 |   31.25 |   53.12 | ...28,433-443,503 
  AuthContext.tsx  |      80 |       75 |     100 |   79.16 | 38-39,47-48,62    
  ToastContext.tsx |   94.73 |       50 |     100 |   93.75 | 49                
 src/hooks         |   48.27 |    34.78 |      60 |   46.34 |                   
  ...estoreSync.ts |     100 |      100 |     100 |     100 |                   
  ...calStorage.ts |       0 |        0 |       0 |       0 | 9-96              
-------------------|---------|----------|---------|---------|-------------------

```
