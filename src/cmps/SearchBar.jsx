import React, { useState, useEffect, useRef } from 'react';

const SearchBar = ({ suggestions, name, handleChange, value, idx , placeholder }) => {
    const [query, setQuery] = useState(value?.name || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');

    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target) &&
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleInputChange = (event) => {
        const name = event.target.value;
        setQuery(name);
        setShowSuggestions(name !== ''); // Show suggestions when the input has content
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.name);
        setSelectedValue(suggestion.value);
        setShowSuggestions(false);
        var target = { name: name, value: suggestion }
        handleChange({ target }, idx >= 0 ? idx : '')
    };

    return (
        <div className="search-container">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                name="supplier"
                placeholder={placeholder || 'search'}
                ref={inputRef}
                className={`input ${showSuggestions ? 'show-border' : ''} `}
            />
            {showSuggestions && (
                <ul className="suggestion-list" ref={suggestionsRef}>
                    {suggestions
                        .filter((suggestion) =>
                            suggestion.name.toLowerCase().includes(query.toLowerCase())
                        )
                        .map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="suggestion-item"
                            >
                                {suggestion.name}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
