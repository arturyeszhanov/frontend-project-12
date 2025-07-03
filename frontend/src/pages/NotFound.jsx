import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
    <h2 className="text-4xl font-bold text-red-600 mb-4">404 — Страница не найдена</h2>
    <p className="text-gray-700 mb-6">Кажется, вы попали не туда 😕</p>
    <Link
      to="/"
      className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Вернуться на главную
    </Link>
  </div>
);

export default NotFound;
