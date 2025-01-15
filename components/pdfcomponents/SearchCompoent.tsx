"use client";
import { useSettings } from '@/context/SettingsContext';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import pdfsearch from '@/public/pdfsearch.svg';
import { ChevronUp, ChevronDown } from 'lucide-react'; // Import navigation icons

const SearchComponent = () => {
    const [searchText, setSearchText] = useState('');
    const [currentMatch, setCurrentMatch] = useState(0);
    const [totalMatches, setTotalMatches] = useState(0);
    const searchInputRef = useRef(null);
    const searchBarRef = useRef(null);
    const { pages } = useSettings();

    const clearHighlights = () => {
        document.querySelectorAll('.matched-highlight, .current-highlight').forEach(el => {
            const parent = el.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(el.textContent || ''), el);
            }
        });
    };

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

        setTotalMatches(0);
        clearHighlights();
        setCurrentMatch(0);

        let totalMatchCount = 0;

        for (let i = 1; i <= pages; i++) {
            const textLayer = document.querySelector(`[data-page-number="${i}"] .textLayer`);
            if (textLayer) {
                totalMatchCount += highlightText(textLayer, searchText);
            }
        }

        setTotalMatches(totalMatchCount);
        if (totalMatchCount > 0) {
            scrollToHighlight(0);
        }
    };

    const scrollToHighlight = (index) => {
        const highlights = document.querySelectorAll('.matched-highlight');
        if (highlights.length === 0) return;

        // Handle wrapping around
        if (index >= highlights.length) index = 0;
        if (index < 0) index = highlights.length - 1;

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

    const handleNext = () => {
        scrollToHighlight(currentMatch);
    };

    const handlePrevious = () => {
        scrollToHighlight(currentMatch - 2);
    };

    const clearSearch = () => {
        setSearchText('');
        setTotalMatches(0);
        setCurrentMatch(0);
        clearHighlights();
    };

    return (
        <div>
            <div
                ref={searchBarRef}
                className="fixed top-32 left-0 right-0 flex justify-center z-50 mt-4"
            >
                <form
                    className="w-[850px] relative group"
                    onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                >
                    <div className="relative w-full h-[43px] group-hover:h-[68px] bg-white rounded-[18px] shadow-lg border border-gray-300 overflow-hidden transition-all duration-300 ease-in-out">
                        {/* Search Icon */}
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 ml-4">
                            <Image src={pdfsearch} alt="Search Icon" width={16} height={16} />
                        </div>

                        {/* Search Input */}
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search in PDF..."
                            className="w-full py-2 pl-16 pr-32 font-rubik text-[20px] text-black focus:outline-none h-[43px] transition-colors duration-300"
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />

                        {/* Navigation Controls */}
                        {totalMatches > 0 && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                                <span className="text-sm text-gray-600">
                                    {currentMatch} of {totalMatches}
                                </span>
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="p-1 hover:bg-gray-100 rounded"
                                    aria-label="Previous match"
                                >
                                    <ChevronUp className="w-4 h-4 text-black" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="p-1 hover:bg-gray-100 rounded"
                                    aria-label="Next match"
                                >
                                    <ChevronDown className="w-4 h-4 text-black" />
                                </button>
                            </div>
                        )}

                        {/* Additional Placeholder Area */}
                        <div className="absolute top-[40px] pl-16 w-full text-black text-[15px] px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Ask acolyte?
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SearchComponent;