// src/components/common/ThemeApplier.tsx
'use client';
import { useEffect, useState } from 'react';

export function ThemeApplier() {
  // On initialise avec 'default' pour éviter un flash de contenu non stylisé
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    // On récupère le thème configuré
    fetch('/api/settings/public')
      .then(res => res.json())
      .then(data => {
        if (data.activeTheme) {
          setTheme(data.activeTheme);
        }
      });
  }, []);

  useEffect(() => {
    // On nettoie les anciennes classes de thème
    document.body.classList.remove('default', 'theme-bakery', 'theme-butcher', 'theme-debug');

    // On applique la nouvelle classe
    if (theme) {
        document.body.classList.add(theme);
    }
  }, [theme]);

  return null; // Ce composant n'affiche rien
}