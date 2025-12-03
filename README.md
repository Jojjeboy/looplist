# Anti List - PWA

A mobile-first Progressive Web App for managing reusable lists, built with React, Tailwind CSS, and Vite.

- **Categories**: Group lists into categories (e.g., Jobb, Privat, Resor).
- **Lists**: Create, copy, move, and delete lists.
- **Items**: Add, edit, delete, check/uncheck items.
- **Templates**: Create lists from predefined templates (Grocery, Gym, etc.).
- **Sorting**: Sort items manually, alphabetically, or by completion status.
- **Voice Input**: Add items using voice dictation.
- **Undo**: Undo accidental deletions of lists and items.
- **Drag and Drop**: Reorder items within a list.
- **Dark Mode**: Toggle between light and dark themes (auto-detected or manual).
- **Cloud Storage**: Data is securely stored in Google Cloud Firestore with real-time synchronization across devices.
- **Offline Support**: Full offline functionality with automatic synchronization when connection is restored.
- **Smart Data Migration**: Automatically migrates existing local data to the cloud upon first login.
- **PWA**: Installable on mobile devices.
- **Internationalization**: Support for English and Swedish.
- **Activity Log**: View recent commits and updates.

## Data Storage Strategy

The application uses **Google Cloud Firestore** as its primary data store.

- **Structure**: Data is stored in a `users/{uid}` collection, ensuring complete data isolation between users.
- **Offline Persistence**: Firestore's `enableIndexedDbPersistence` is enabled, allowing the app to work seamlessly without an internet connection. Changes made offline are queued and synced automatically when the connection is restored.
- **Real-time Sync**: The app uses real-time listeners (`onSnapshot`) to instantly reflect changes made on other devices.
- **Migration**: A custom hook `useMigrateLocalStorage` detects if a user has existing local data but no cloud data, and automatically migrates it to Firestore on their first login.

## Tech Stack
- **Frontend Framework**: React (TypeScript)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Internationalization**: i18next, react-i18next
- **Drag and Drop**: @dnd-kit
- **Icons**: Lucide React
- **PWA**: vite-plugin-pwa
- **Utils**: suncalc (for auto theme), uuid

## Documentation & Prompts
For a detailed log of the prompts used to build this application, please refer to:
[PromptsMade.md](./PromptsMade.md)

## Setup & Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## PWA Icons
To fully enable PWA installation, please add the following icons to the `public` directory:
- `pwa-192x192.png`
- `pwa-512x512.png`



