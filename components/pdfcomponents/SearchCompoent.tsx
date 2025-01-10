"use client"
import { useSettings } from '@/context/SettingsContext';
import React, { useState, useEffect } from 'react'


const SearchComponent = () => {
    const [searchText, setSearchText] = useState('');
    const [currentMatch, setCurrentMatch] = useState(0);
    const [totalMatches, setTotalMatches] = useState(0);
    const { pages } = useSettings();

    // Helper function to clear all highlights
    const clearHighlights = () => {
        document.querySelectorAll('.matched-highlight, .current-highlight').forEach(el => {
            const parent = el.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(el.textContent || ''), el);
            }
        });
    };

    // Function to highlight search matches in a given text layer
    const highlightText = (textLayer, searchStr) => {
        const textNodes = Array.from(textLayer.querySelectorAll('span, div'));
        let matchCount = 0;

        textNodes.forEach(node => {
            const text = node.textContent || '';
            const lowerText = text.toLowerCase();
            const lowerSearch = searchStr.toLowerCase();
            let position = 0;

            while ((position = lowerText.indexOf(lowerSearch, position)) !== -1) {
                if (node.firstChild) {
                    const range = document.createRange();
                    const span = document.createElement('span');
                    span.classList.add('matched-highlight');
                    span.style.backgroundColor = 'yellow';

                    try {
                        range.setStart(node.firstChild, position);
                        range.setEnd(node.firstChild, position + searchStr.length);
                        range.surroundContents(span);
                    } catch (error) {
                        console.warn('Failed to highlight text:', error);
                    }

                    matchCount++;
                }
                position += searchStr.length;
            }
        });

        return matchCount;
    };

    const handleSearch = () => {
        if (!searchText) return;

        // Reset matches and clear previous highlights
        setTotalMatches(0);
        clearHighlights();

        let totalMatches = 0;

        for (let i = 1; i <= pages; i++) {
            const textLayer = document.querySelector(`[data-page-number="${i}"] .textLayer`);
            if (textLayer) {
                totalMatches += highlightText(textLayer, searchText);
            }
        }

        setTotalMatches(totalMatches);
        if (totalMatches > 0) {
            scrollToHighlight(0);
        }
    };

    const scrollToHighlight = (index) => {
        const highlights = document.querySelectorAll('.matched-highlight');
        if (highlights.length === 0 || index < 0 || index >= highlights.length) {
            console.warn('Invalid highlight index or no highlights available');
            return;
        }

        // Clear previous current highlight
        document.querySelectorAll('.current-highlight').forEach(el => {
            el.classList.remove('current-highlight');
            el.style.backgroundColor = 'yellow';
        });

        // Highlight the current match
        const currentHighlight = highlights[index];
        currentHighlight.classList.add('current-highlight');
        currentHighlight.style.backgroundColor = 'orange';

        // Scroll to the current match
        currentHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setCurrentMatch(index + 1);
    };

    const clearSearch = () => {
        setSearchText('');
        setTotalMatches(0);
        setCurrentMatch(0);
        clearHighlights();
    };

    return (
        <div>
            <div className="flex items-center gap-2 mb-4 p-2 bg-gray-100 rounded">
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search in PDF..."
                    className="px-3 py-1 border rounded"
                />
                <button
                    onClick={handleSearch}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                    Search
                </button>
                <button
                    onClick={() => scrollToHighlight(currentMatch - 2)}
                    disabled={!totalMatches}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    ↑
                </button>
                <button
                    onClick={() => scrollToHighlight(currentMatch)}
                    disabled={!totalMatches}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    ↓
                </button>
                {totalMatches > 0 && (
                    <span className="text-sm">
                        {currentMatch} of {totalMatches} matches
                    </span>
                )}
                <button
                    onClick={clearSearch}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default SearchComponent;



