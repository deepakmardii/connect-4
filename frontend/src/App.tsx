import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router";
import Home from "./Home";
import Game from "./Game";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/game", element: <Game /> }
]);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;
