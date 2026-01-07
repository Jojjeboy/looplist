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
- **Data Portability**: Export and import data via JSON.

## 🛠 Tech Stack

- **Framework**: React 19 (TypeScript)
- **State**: React Context + Firestore real-time listeners
- **Styling**: Tailwind CSS + Lucide Icons
- **Drag & Drop**: `@dnd-kit`
- **PWA**: `vite-plugin-pwa`
- **Testing**: Vitest + React Testing Library

## 📦 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server with auto-commit generation:

```bash
npm run dev
```

### Production

Build for production (includes type checking and commit sync):

```bash
npm run build
```

The production build will be available in the `dist/` directory.

## 📱 PWA Setup

To fully enable PWA installation, please ensures the following icons are in the `public/` directory:

- `pwa-192x192.png`
- `pwa-512x512.png`

## 🧪 Testing

The project uses Vitest for testing. All major components and context logic are covered.

```bash
# Run all tests with coverage report
npm run test

# Run tests in UI mode
npx vitest --ui

# Full validation (Build -> Lint -> Check Any -> Test)
npm run validate
```

## 🔐 Security & Data

- **Authentication**: Google Sign-In via Firebase Auth.
- **Privacy**: Data is isolated per user using Firestore security rules (`users/{uid}`).
- **Persistence**: Uses Firestore's IndexedDB persistence for offline-first support.

## 📜 Original Vision

> Jag vill bygga en progressive web app som jag ska kunna spara ner till min telefon, den behöver vara mobile first. Lagring kan ske i localstorage. Den har till syfte att skapa listor som jag återanvänder. Det skulle kunna vara en lista för att komma ihåg vad jag ska ta med till jobbet. Det skulle också kunna vara en lista för att komma ihåg vad jag ska packa när jag går till gymmet eller vad jag ska fixa inför en långrunda när jag går ut och springer osv osv. Viktig funktion på varje lista är att jag ska kunna: 1. Lägga till och ta bort nya punkter, bocka av varje punkt, redigera befintliga punkter, dra och skapa varje punkt upp och ner. Också viktigt att kunna via en knapp kunna avbocka alla så att alla punkter i listan nollställs. Listor ska grupperas in i kategorier så som Jobb, Privat, Resor osv osv. Man ska kunna ta bort och lägga till kategorier. Tar man bort en kategori, tas även listan/listorna i kategorin bort. Listor ska kunna flyttas mellan kategorier. Listor ska också kunna kopieras och få samma namn men med (kopia) tillagt i namnet. Jag vill ha ett modernt utseende och helst använda tailwind CSS. Det Lightmode ska vara default men man ska även kunna toggla till Darkmode. Jag vill att utssendet liknar utseendet i denna demon https://www.youtube.com/watch?v=L8wEC6A5HQY

## 📝 License

MIT
