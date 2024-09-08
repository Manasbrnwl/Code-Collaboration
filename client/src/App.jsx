import React from 'react'
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import EditorPage from "./components/EditorPage";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
    <Toaster />
    <Routes>
      <Route path="/" Component={Home} />
      <Route path="/editor/:roomId" Component={EditorPage} />
    </Routes>
    </>
  );
}

export default App;
