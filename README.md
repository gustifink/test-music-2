# 🎵 **Test Music - Spotify Clone**

## 🚀 **Overview**

A modern music streaming app built using **React.js** and styled with **Tailwind CSS**! This app features a clean and responsive design with interactive elements that mimic the look and feel of Spotify. Browse songs, manage playlists, and enjoy a seamless music experience.

## 🌟 **Key Features**

- **🎶 Interactive Music Player**: Play, pause, and control playback with ease
- **📋 Playlist Management**: Create playlists and add songs via context menu
- **🎵 Song Pages**: Detailed song view with artist info and recommendations
- **💻 Responsive Design**: Mobile-first approach that looks great on all screen sizes
- **🔍 Song Display & Navigation**: View song details and navigate between sections
- **🎛️ Context Menus**: Right-click or use "..." button to add songs to playlists
- **🔄 State Management**: Efficient state management using React Context

## 💻 **Technologies Used**

- **Frontend**: React.js, Tailwind CSS, Vite
- **State Management**: React Context API
- **Routing**: React Router
- **Tools**: ESLint for code linting, PostCSS for CSS processing

## ⚙️ **Installation Guide**

To run the project locally, follow these steps:

1. **Clone** the repository to your local machine.

   ```bash
   git clone https://github.com/gustifink/test-music-2.git
   ```

2. **Install dependencies**:

   ```bash
   cd test-music-2
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. Open your browser and go to `http://localhost:5173` to see the app in action!

## 🎯 **How to Use**

- **Browse Songs**: Navigate through the song list and click to explore song details
- **Play Music**: Click on a song row to play, or click the title to view song page
- **Create Playlists**: Click "Create" in the sidebar to create a new playlist
- **Add to Playlist**: Right-click any song or use the "..." button to add to a playlist
- **Responsive**: Resize your browser or view on mobile to experience the responsive design

## 🤖 **AI Model Verifier**

This project includes an **AI Model Verifier** - a Playwright-based testing framework for automated task verification.

### Features

- **Headed Browser Execution**: Watch the browser perform tasks in real-time
- **Execution History**: Track all test runs with pass/fail status
- **HTML Report Viewer**: Detailed step-by-step test analysis with screenshots
- **Screenshot Capture**: Automatic screenshots at each step for debugging

### Prerequisites

> ⚠️ Complete the [Installation Guide](#%EF%B8%8F-installation-guide) first, then install Playwright browsers:

```bash
npx playwright install
```

### Running the Verifier

1. **Start the music player** (in one terminal):

   ```bash
   npm run dev
   ```

2. **Start the Verifier API** (in another terminal):

   ```bash
   npm run api
   ```

3. **Open the Verifier UI**:
   - Go to `http://localhost:3001`
   - Click "Run Execution" to start a test
   - Watch the browser perform: Create playlist → Add song → Play it
   - View results in History and the HTML Report

### Test Task

The verifier tests the complete user flow:

1. Create a new playlist
2. Navigate to an existing playlist with songs
3. Add a song to the new playlist via context menu
4. Navigate to the new playlist
5. Play the added song

## 📂 **Folder Structure**

```bash
test-music-2/
├── public/                 # Public assets
└── src/                    # Source code files
    ├── App.jsx             # Main App component
    ├── index.css           # Global CSS with Tailwind
    ├── main.jsx            # Entry point for React app
    ├── assets/             # Static assets (images, data)
    │   └── assets.js       # Song and library data
    ├── components/         # React components
    │   ├── ContextMenu.jsx # Context menu for song actions
    │   ├── CreateMenu.jsx  # Create playlist menu
    │   ├── Display.jsx     # Main display router
    │   ├── DisplayHome.jsx # Home page component
    │   ├── Play.jsx        # Bottom player bar
    │   ├── PlaylistPage.jsx# Playlist detail page
    │   ├── RightPanel.jsx  # Now playing panel
    │   ├── Sidebar.jsx     # Library sidebar
    │   ├── SongPage.jsx    # Song detail page
    │   └── TopBar.jsx      # Navigation bar
    └── context/            # React context
        └── PlayContext.jsx # Music player state management
```

## 🤝 **Contributing**

Contributions are welcome! Fork the repository and create a pull request:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request

---

Enjoy the **Test Music** experience! 🎧
