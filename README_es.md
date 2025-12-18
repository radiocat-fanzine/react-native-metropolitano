# MetroApp - Sistema de Gestión de Movilidad Urbana

## 🚆 1. Contexto y Propuesta de Valor

### El Problema
El Metropolitano de Lima depende de tarjetas físicas con un sistema de consulta de saldo limitado a puntos de recarga físicos. El mayor punto de dolor ocurre en los **buses alimentadores**: el cobro se realiza a bordo con el vehículo en marcha. Si el usuario descubre en ese momento que no tiene saldo, queda en una situación de vulnerabilidad sin alternativas digitales para resolverlo en tiempo real.

### El MVP (Mínimo Producto Viable)
MetroApp soluciona esta incertidumbre mediante un asistente de movilidad que permite:

* **Gestión de Datos:** Centralización de la información de rutas y previsión de saldo.
* **Planificación Inteligente:** Localización de estaciones y cálculo de trayectos.
* **Personalización:** Sistema de **Rutas Favoritas** para acceso inmediato a trayectos frecuentes, reduciendo el tiempo de interacción en situaciones de alta demanda.

---

## 🏗 2. Arquitectura de Software y Lógica de Programación
Se uso una estructura organizada donde los datos viajan en un solo sentido. Esto hace que la aplicación sea más estable, fácil de probar y mucho más sencilla de actualizar a futuro.

### Estructura del Proyecto y Flujo Lógico
* **`src/api/` (Capa de Infraestructura):** Centraliza la lógica de servicios. Contiene la inicialización de **Firebase** para la sincronización en la nube y el motor de **SQLite** para el almacenamiento relacional local.
* **`src/navigation/` (Gestión de Flujos):** Utiliza **React Navigation** con una lógica de renderizado condicional. Separa el flujo de acceso (`AuthStack`) de la experiencia principal (`MainStack`), protegiendo las rutas mediante el estado global de sesión.
* **`src/redux/` (Estado Global):** Implementado con **Redux Toolkit**. Actúa como la "única fuente de verdad". Las acciones del usuario disparan cambios en *Slices* específicos (`userSlice`, `searchSlice`), que notifican automáticamente a los componentes suscritos.
* **`src/screens/` (Capa de Presentación):**
    * **`/Auth/`:** Gestión de identidad y acceso.
    * **`/Explore/`:** Módulo de mayor complejidad técnica. Gestiona estados dinámicos de búsqueda, integración de mapas y una sub-arquitectura de componentes y modales internos para el cálculo de rutas.
    * **`/Main/`:** Contiene las pantallas raíz del Tab Bar (Home, Explora, Favoritos, Perfil).
* **`src/styles/` (Design System):** Centralización de tokens visuales (colores, tipografía) para asegurar coherencia en toda la interfaz.

---

## 🛠 3. Implementación Técnica y Lógica de Datos

### Estrategia de Persistencia Híbrida (Offline-First)
Para garantizar la operatividad en entornos con conectividad inestable, se diseñó un sistema de persistencia dual:

1.  **Firebase (Cloud):** Respalda el perfil del usuario y sus rutas favoritas, permitiendo la recuperación multi-dispositivo.
2.  **SQLite (Local):** Registra búsquedas y configuraciones críticas directamente en el dispositivo. Esta lógica permite que el historial y la planificación de rutas estén disponibles instantáneamente, incluso sin conexión a internet.

### Inteligencia de Contexto (Location API)
La aplicación procesa las coordenadas crudas del dispositivo mediante la **Location API** para:
* Situar al usuario en el mapa de la red.
* Filtrar estaciones por proximidad geográfica.
* Optimizar el punto de partida en el motor de búsqueda, minimizando la carga manual de datos.

### Lógica de Navegación (Bottom Tabs)
El sistema se organiza en 4 ejes estratégicos:
* **Home:** Dashboard con resumen de actividad.
* **Explora:** Motor de planificación y búsqueda de estaciones.
* **Favoritos:** Acceso directo a la base de datos de rutas preferidas.
* **Perfil:** Gestión de cuenta y cierre de sesión seguro (limpieza de estados y caché).

---

## 📦 4. Instalación y Despliegue

Este proyecto utiliza **Expo**, lo que permite una ejecución rápida en dispositivos físicos o emuladores.

### Configuración para Desarrollo
1.  **Clonar el repositorio:** `git clone https://github.com/radiocat-fanzine/react-native-metropolitano.git`
2.  **Instalar dependencias:** `npm install`
3.  **Configurar variables de entorno:** Crear un archivo `.env` en la raíz con tus llaves (ver `.env.example` como referencia):
    ```env
    EXPO_PUBLIC_FIREBASE_API_KEY=tu_firebase_key
    EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=tu_google_places_key
    ```
4.  **Iniciar con Expo:** `npx expo start -c`  
    *Escanea el código QR con la app **Expo Go** (Android/iOS) para probarla en tu celular.*

### Probar la aplicación (Android)
Si deseas probar la versión final sin configurar el entorno de desarrollo, puedes descargar el archivo **APK** directamente aquí:
* [🔗 Descargar MetroApp APK para Android](https://expo.dev/accounts/radiocat_fanzine/projects/metroapp/builds/9f0e3a29-a91c-4ca1-9bbd-bf7f12045849)


