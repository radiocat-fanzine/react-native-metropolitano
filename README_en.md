# MetroApp - Urban Mobility Management System

## 🚆 1. Context and Value Proposition

### The Problem
Lima's "Metropolitano" transit system relies on physical smart cards with balance inquiries restricted to physical top-up points. The most critical pain point occurs in the **feeder buses** (*alimentadores*): fares are validated on-board while the vehicle is in motion. If users discover at that moment that they have insufficient funds, they are left in a vulnerable situation with no immediate digital alternatives to resolve it in real-time.

### The MVP (Minimum Viable Product)
MetroApp resolves this uncertainty through a mobility assistant that enables:

* **Data Management:** Centralization of route information and balance forecasting.
* **Smart Planning:** Station localization and real-time route calculation.
* **Personalization:** A **Favorite Routes** system for immediate access to frequent trips, reducing interaction time during high-demand situations.

---

## 🏗 2. Software Architecture and Programming Logic
The project uses an organized structure where data travels in a single direction (unidirectional data flow). This makes the application more stable, easier to test, and significantly simpler to update in the future.

### Project Structure and Logical Flow
* **`src/api/` (Infrastructure Layer):** Centralizes service logic. It contains the **Firebase** initialization for cloud synchronization and the **SQLite** engine for local relational storage.
* **`src/navigation/` (Flow Management):** Uses **React Navigation** with conditional rendering logic. It separates the access flow (`AuthStack`) from the main experience (`MainStack`), protecting routes through the global session state.
* **`src/redux/` (Global State):** Implemented with **Redux Toolkit**. It acts as the "single source of truth." User actions trigger changes in specific *Slices* (`userSlice`, `searchSlice`), which automatically notify subscribed components.
* **`src/screens/` (Presentation Layer):**
    * **`/Auth/`:** Identity and access management.
    * **`/Explore/`:** The most technically complex module. It manages dynamic search states, map integration, and a sub-architecture of internal components and modals for route calculation.
    * **`/Main/`:** Contains the root screens of the Tab Bar (**Home, Explore, Favorites, Profile**).
* **`src/styles/` (Design System):** Centralization of visual tokens (colors, typography) to ensure consistency across the entire interface.

---

## 🛠 3. Technical Implementation and Data Logic

### Hybrid Persistence Strategy (Offline-First)
To ensure operability in environments with unstable connectivity, a dual persistence system was designed:

1.  **Firebase (Cloud):** Backs up the user profile and favorite routes, allowing for multi-device recovery.
2.  **SQLite (Local):** Logs searches and critical settings directly on the device. This logic ensures that history and route planning are available instantaneously, even without an internet connection.

### Contextual Intelligence (Location API)
The application processes the device's raw coordinates via the **Location API** to:
* Position the user on the transit network map.
* Filter stations by geographic proximity.
* Optimize the starting point in the search engine, minimizing manual data entry.

### Navigation Logic (Bottom Tabs)
The system is organized into 4 strategic axes:
* **Home:** Dashboard with an activity summary.
* **Explore:** Search and station planning engine.
* **Favorites:** Direct access to the database of preferred routes.
* **Profile:** Account management and secure logout (state and cache clearing).

---

## 📦 4. Installation and Deployment

This project is built using **Expo**, enabling fast execution on physical devices or emulators.

### Development Setup
1.  **Clone the repository:** `git clone https://github.com/radiocat-fanzine/react-native-metropolitano.git`
2.  **Install dependencies:** `npm install`
3.  **Configure Environment Variables:** Create a `.env` file in the root directory (see `.env.example` for reference):
    ```env
    EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_key
    EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_key
    ```
4.  **Start with Expo:** `npx expo start -c`  
    *Scan the QR code with the **Expo Go** app (Android/iOS) to test it on your device.*

### Direct Demo (Android)
If you wish to test the final version without setting up the development environment, you can download the **APK** file directly here:
* [🔗 Download MetroApp APK for Android](https://expo.dev/accounts/radiocat_fanzine/projects/metroapp/builds/9f0e3a29-a91c-4ca1-9bbd-bf7f12045849)