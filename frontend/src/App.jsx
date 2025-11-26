import React from 'react';
import Example from './components/Example';

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Frontend в Docker</h1>
      </header>
      <main>
        <Example message="Привет из вашего Dockerized приложения!" />
      </main>
    </div>
  );
}