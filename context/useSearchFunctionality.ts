import { useSettings } from '@/context/SettingsContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import _ from 'lodash';

const useSearchFunctionality = () => {
    const { pages, scale } = useSettings();
    const [searchState, setSearchState] = useState({
        searchText: '',
        currentMatch: 0,
        totalMatches: 0,
        highlights: []
    });

    const createHighlightElement = useCallback((node, startOffset, endOffset, matchIndex, pageNumber) => {
        const range = document.createRange();
        const textNode = node.firstChild;
        if (!textNode) return null;
        
        range.setStart(textNode, startOffset);
        range.setEnd(textNode, endOffset);
        
        const rects = range.getClientRects();
        if (rects.length === 0) return null;

        const pdfPage = node.closest('.react-pdf__Page');
        if (!pdfPage) return null;

        const pageRect = pdfPage.getBoundingClientRect();
        const highlights = [];

        for (const rect of rects) {
            const highlight = document.createElement('div');
            highlight.classList.add('pdf-search-highlight');
            
            const scaledPositions = {
                left: (rect.left - pageRect.left) * scale,
                top: (rect.top - pageRect.top) * scale,
                width: rect.width * scale,
                height: rect.height * scale
            };
            
            Object.assign(highlight.style, {
                position: 'absolute',
                ...scaledPositions,
                backgroundColor: '#FFEB3B80',
                mixBlendMode: 'multiply',
                pointerEvents: 'none'
            });

            Object.assign(highlight.dataset, {
                highlightIndex: matchIndex,
                pageNumber,
                scale
            });

            pdfPage.appendChild(highlight);
            highlights.push(highlight);
        }

        return highlights;
    }, [scale]);

    const updateHighlights = useCallback(() => {
        document.querySelectorAll('.pdf-search-highlight').forEach(highlight => {
            const currentScale = parseFloat(highlight.dataset.scale);
            if (currentScale === scale) return;

            const pdfPage = highlight.closest('.react-pdf__Page');
            if (!pdfPage) return;

            const originalDimensions = ['left', 'top', 'width', 'height'].reduce((acc, prop) => {
                acc[prop] = parseFloat(highlight.style[prop]) / currentScale;
                return acc;
            }, {});

            Object.entries(originalDimensions).forEach(([prop, value]) => {
                highlight.style[prop] = `${value * scale}px`;
            });
            highlight.dataset.scale = scale;
        });
    }, [scale]);

    const performSearch = useCallback(_.debounce((searchText) => {
        document.querySelectorAll('.pdf-search-highlight').forEach(el => el.remove());
        if (!searchText.trim()) return;

        let totalMatchCount = 0;
        const newHighlights = [];

        for (let pageNum = 1; pageNum <= pages; pageNum++) {
            const textLayer = document.querySelector(`[data-page-number="${pageNum}"] .react-pdf__Page__textContent`);
            if (!textLayer) continue;

            const textNodes = Array.from(textLayer.querySelectorAll('span'));
            textNodes.forEach(node => {
                const text = node.textContent.toLowerCase();
                const searchStr = searchText.toLowerCase();
                let position = 0;

                while ((position = text.indexOf(searchStr, position)) !== -1) {
                    const highlightElements = createHighlightElement(
                        node,
                        position,
                        position + searchText.length,
                        totalMatchCount,
                        pageNum
                    );

                    if (highlightElements) {
                        newHighlights.push(...highlightElements.map(element => ({
                            element,
                            pageNumber: pageNum,
                            index: totalMatchCount,
                            text: node.textContent.substr(position, searchText.length)
                        })));
                        totalMatchCount++;
                    }
                    position += searchText.length;
                }
            });
        }

        setSearchState(prev => ({
            ...prev,
            highlights: newHighlights,
            totalMatches: totalMatchCount,
            currentMatch: totalMatchCount > 0 ? 1 : 0
        }));

        if (totalMatchCount > 0) {
            setTimeout(() => navigateHighlight(0), 100);
        }
    }, 300), [pages, createHighlightElement]);

    const navigateHighlight = useCallback((index) => {
        const highlights = document.querySelectorAll('.pdf-search-highlight');
        if (!highlights.length) return;

        index = ((index % highlights.length) + highlights.length) % highlights.length;

        highlights.forEach(el => {
            el.style.backgroundColor = '#FFEB3B80';
            el.classList.remove('current-highlight');
        });

        const currentElement = highlights[index];
        if (currentElement) {
            currentElement.style.backgroundColor = '#FF980080';
            currentElement.classList.add('current-highlight');
            currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            setSearchState(prev => ({ ...prev, currentMatch: index + 1 }));
        }
    }, []);

    useEffect(() => {
        updateHighlights();
    }, [scale, updateHighlights]);

    useEffect(() => {
        const handleResize = _.debounce(() => {
            if (searchState.highlights.length > 0) {
                performSearch(searchState.searchText);
            }
        }, 300);

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            handleResize.cancel();
        };
    }, [searchState.highlights.length, searchState.searchText, performSearch]);

    return {
        search: performSearch,
        navigateNext: () => navigateHighlight(searchState.currentMatch),
        navigatePrevious: () => navigateHighlight(searchState.currentMatch - 2),
        clearSearch: () => {
            document.querySelectorAll('.pdf-search-highlight').forEach(el => el.remove());
            setSearchState({
                searchText: '',
                currentMatch: 0,
                totalMatches: 0,
                highlights: []
            });
        },
        searchState
    };
};

export default useSearchFunctionality;