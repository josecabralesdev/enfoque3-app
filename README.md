# Enfoque3 📸✨

**Enfoque3** es una aplicación de bienestar minimalista desarrollada con **React Native y Expo**. El concepto es simple: solo puedes capturar **3 momentos de gratitud al día**. Sin feeds sociales, sin likes y sin comparaciones. Solo tú y tus motivos para estar agradecido.

## 🧠 Filosofía
En un mundo saturado de notificaciones y validación externa, **Enfoque3** propone un ejercicio de introspección diaria:
- **Límite Intencional:** Solo 3 fotos al día para forzarte a elegir lo que realmente importa.
- **Privacidad Local:** Tus datos nunca salen de tu teléfono.
- **Minimalismo Digital:** Una interfaz limpia diseñada para la calma.

## 🚀 Características
- **Cámara Minimalista:** Interfaz de captura rápida y directa.
- **Almacenamiento Local:** Persistencia de datos usando `expo-sqlite`.
- **Recordatorios Diarios:** Notificaciones push programadas para ayudarte a mantener el hábito.
- **Sin Nube:** Almacenamiento local mediante `expo-file-system`.

## 🛠️ Stack Tecnológico
- **Framework:** [React Native (Expo)](https://expo.dev/)
- **Base de Datos:** [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Cámara:** [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- **Notificaciones:** [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)

## 📦 Instalación y Uso

1. **Clona el repositorio:**
   ```bash
   git clone [https://github.com/josecabralesdev/enfoque3-app.git](https://github.com/josecabralesdev/enfoque3-app.git)
   cd enfoque3
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia la aplicación:**
    ```bash
    npx expo start
    ```

4. **Visualiza la app:**
- Escanea el código QR con la app Expo Go (Android/iOS).
- O presiona `i` para simulador de iOS o `a` para emulador de Android.

## 📂 Estructura del Proyecto

├── src/
│   ├── db/
│   │   └── database.js    # Lógica de SQLite
│   ├── screens/
│   │   └── HomeScreen.js  # Pantalla principal y Cámara
│   └── components/        # Componentes reutilizables
├── App.js                 # Configuración de notificaciones y entrada
└── app.json               # Configuración de Expo

## 📝 Notas de Configuración

La aplicación requiere permisos de:
- **Cámara:** Para capturar los momentos.
- **Notificaciones:** Para los recordatorios diarios a las 8:00 PM.

*Desarrollado como una herramienta para la salud mental y la apreciación diaria.*