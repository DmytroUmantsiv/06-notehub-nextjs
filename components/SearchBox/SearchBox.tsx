'use client';

import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
   <input
  className={css.input}
  id="search"
  name="search"
  type="search"
  value={value}
  onChange={(e) => onChange(e.target.value)}
  autoComplete="off"
/>
  );
}
