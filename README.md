# Anti List - PWA

A mobile-first Progressive Web App for managing reusable lists, built with React, TypeScript, Tailwind CSS, and Vite.

## 🚀 Features

- **Start Page Overview**: A unified view of all categories and their associated lists.
- **Flattened Navigation**: Direct access to lists from the start page without intermediary category detail views.
- **Lists Management**: Create, copy, move (between categories), and delete lists with ease.
- **Dynamic Items**: Add, edit, and delete list items.
- **Three-Stage Mode**: Support for an advanced workflow (Unchecked -> Prepared -> Completed).
- **Templates (Saved Combinations)**: Create permanent reusable templates from multiple list combinations (e.g., "Morning Routine", "Travel Pack").
- **Quick Sessions**: Group multiple lists into a temporary executable session for rapid progress.
- **Smart Sorting**: Sort items manually (drag & drop), alphabetically, or by completion status.
- **Voice Input**: Dictate items directly into lists using speech-to-text.
- **Undo Functionality**: Instant recovery for accidental deletions of lists and items.
- **Cloud Synchronization**: Secure data storage in Google Cloud Firestore with real-time sync across all your devices.
- **Offline First**: Full functionality without internet. Changes are queued and synced automatically when back online.
- **Dark Mode**: Automated theme switching based on local sunrise/sunset or manual toggle.
- **Internationalization**: localized in English and Swedish.

## 🛠 Tech Stack

- **Framework**: React 19 (TypeScript)
- **State**: React Context + Firestore real-time listeners
- **Styling**: Tailwind CSS + Lucide Icons
- **Drag & Drop**: `@dnd-kit`
- **PWA**: `vite-plugin-pwa`
- **Testing**: Vitest + React Testing Library

## 📦 Scripts

| Command             | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| `npm run dev`       | Start development server with auto-commit generation          |
| `npm run build`     | Build for production (includes type checking and commit sync) |
| `npm run test`      | Run all unit tests with coverage report                       |
| `npm run lint`      | Lint codebase for style and errors                            |
| `npm run check-any` | Strict linting to ensure no `any` types are used              |
| `npm run validate`  | Full CI pipeline: Build -> Lint -> Check Any -> Test          |

## 🧪 Testing

The project uses Vitest for testing. All major components and context logic are covered.

```bash
# Run all tests
npm run test

# Run tests in UI mode
npx vitest --ui
```

## 🔐 Security & Data

- **Authentication**: Google Search-In via Firebase Auth.
- **Privacy**: Data is isolated per user using Firestore security rules (`users/{uid}`).
- **Offline**: Uses Firestore's IndexedDB persistence.

## 📝 License

MIT
