import { useState } from 'react';

// Search box: calls onSearch(text) when the user submits or clears
export default function SearchBar({ onSearch, placeholder = 'Search...' }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(text.trim());
  }

  function handleClear() {
    setText('');
    onSearch('');
  }

  return (
    <form className="searchbar" onSubmit={handleSubmit}>
      <input id="search-input" type="search" value={text} placeholder={placeholder} onChange={(e) => setText(e.target.value)} />
      <button id="search-btn" className="btn primary" type="submit">Search</button>
      <button className="btn" type="button" onClick={handleClear}>Clear</button>
    </form>
  );
}
