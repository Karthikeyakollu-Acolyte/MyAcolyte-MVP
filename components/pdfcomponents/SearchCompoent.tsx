import { useSettings } from '@/context/SettingsContext';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import pdfsearch from '@/public/pdfsearch.svg';
import { ChevronUp, ChevronDown } from 'lucide-react';
import _ from 'lodash';

const SearchComponent = () => {
    const [searchText, setSearchText] = useState('');
    const [currentMatch, setCurrentMatch] = useState(0);
    const [totalMatches, setTotalMatches] = useState(0);
    const [highlights, setHighlights] = useState([]);
    const searchInputRef = useRef(null);
    const searchBarRef = useRef(null);
    const { pages,scale } = useSettings();

    const clearHighlights = () => {
        document.querySelectorAll('.pdf-search-highlight').forEach(el => {
            el.remove();
        });
        setHighlights([]);
    };

    const createHighlightElement = (node, startOffset, endOffset, matchIndex, pageNumber) => {
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

        // Create highlight for each rect (handles multi-line text)
        for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
            const highlight = document.createElement('div');
            highlight.classList.add('pdf-search-highlight');
            // rect.style.position='relative'
            highlight.style.position = 'absolute';
            highlight.style.left = `${rect.left - pageRect.left}px`;
            highlight.style.top = `${rect.top - pageRect.top}px`;
            highlight.style.width = `${rect.width}px`;
            highlight.style.height = `${rect.height}px`;
            highlight.style.backgroundColor = '#FFEB3B80';
            highlight.style.mixBlendMode = 'multiply';
            highlight.style.pointerEvents = 'none';
            highlight.dataset.highlightIndex = matchIndex;
            highlight.dataset.pageNumber = pageNumber;

            pdfPage.appendChild(highlight);
            highlights.push(highlight);
        }

        return highlights;
    };

    const highlightText = (textLayer, searchStr, pageNumber) => {
        if (!searchStr.trim()) return 0;
        
        const textNodes = Array.from(textLayer.querySelectorAll('span'));
        let matchCount = 0;
        const newHighlights = [];

        textNodes.forEach(node => {
            const text = node.textContent;
            const lowerText = text.toLowerCase();
            const lowerSearch = searchStr.toLowerCase();
            let position = 0;

            while ((position = lowerText.indexOf(lowerSearch, position)) !== -1) {
                const highlightElements = createHighlightElement(
                    node,
                    position,
                    position + searchStr.length,
                    matchCount,
                    pageNumber
                );

                if (highlightElements) {
                    highlightElements.forEach(element => {
                        newHighlights.push({
                            element,
                            pageNumber,
                            index: matchCount,
                            text: text.substr(position, searchStr.length)
                        });
                    });
                    matchCount++;
                }
                position += searchStr.length;
            }
        });

        setHighlights(prev => [...prev, ...newHighlights]);
        return matchCount;
    };

    // Debounced search function
    const debouncedSearch = useRef(
        _.debounce((searchText) => {
            clearHighlights();
            setCurrentMatch(0);
            setTotalMatches(0);

            let totalMatchCount = 0;


            for (let i = 1; i <= pages; i++) {
                const textLayer = document.querySelector(`[data-page-number="${i}"] .react-pdf__Page__textContent`);
                console.log(textLayer,pages)
                if (textLayer) {
                    totalMatchCount += highlightText(textLayer, searchText, i);
                }
            }

            setTotalMatches(totalMatchCount);
            if (totalMatchCount > 0) {
                setTimeout(() => scrollToHighlight(0), 100);
            }
        }, 300)
    ).current;

    const handleSearch = (e) => {
        e?.preventDefault();
        if (!searchText) return;
        debouncedSearch(searchText);
    };

    const scrollToHighlight = (index) => {
        const highlightElements = document.querySelectorAll('.pdf-search-highlight');
        if (highlightElements.length === 0) return;

        // Handle wrapping
        if (index >= highlightElements.length) index = 0;
        if (index < 0) index = highlightElements.length - 1;

        // Reset all highlights to default color
        highlightElements.forEach(el => {
            el.style.backgroundColor = '#FFEB3B80';
            el.classList.remove('current-highlight');
        });

        // Highlight current match
        const currentElement = highlightElements[index];
        if (currentElement) {
            currentElement.style.backgroundColor = '#FF980080';
            currentElement.classList.add('current-highlight');

            // Get the page containing the highlight
            const pageNumber = currentElement.dataset.pageNumber;
            const pdfPage = document.querySelector(`[data-page-number="${pageNumber}"]`);
            
            if (pdfPage) {
                // Approach 2: Use scrollIntoView
                currentElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }

            setCurrentMatch(index + 1);
        }
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

    useEffect(() => {
        return () => {
            clearHighlights();
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 400); // Adjust the delay time as needed
    
        return () => clearTimeout(delayDebounceFn);
    }, [scale]);

    // Handle window resize
    useEffect(() => {
        const handleResize = _.debounce(() => {
            if (highlights.length > 0) {
                clearHighlights();
                handleSearch();
            }
        }, 300);

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            handleResize.cancel();
        };
    }, [highlights, searchText]);

    return (
        <div>
            <div
                ref={searchBarRef}
                className="fixed top-32 left-0 right-0 flex justify-center z-50 mt-4"
            >
                <form
                    className="w-[850px] relative group"
                    onSubmit={handleSearch}
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
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                if (e.target.value) {
                                    debouncedSearch(e.target.value);
                                } else {
                                    clearSearch();
                                }
                            }}
                            placeholder="Search in PDF..."
                            className="w-full py-2 pl-16 pr-32 font-rubik text-[20px] text-black focus:outline-none h-[43px] transition-colors duration-300"
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

            {/* Add global styles for highlights */}
            <style jsx global>{`
                .pdf-search-highlight {
                    position: absolute;
                    pointer-events: none;
                    transition: background-color 0.2s ease;
                    z-index: 1;
                }
                .current-highlight {
                    box-shadow: 0 0 4px rgba(255, 152, 0, 0.5);
                }
                .react-pdf__Page {
                    position: relative;
                }
            `}</style>
        </div>
    );
};

export default SearchComponent;




// export function PDFTextSearch({ pdfDocument, numPages }) {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [foundMatches, setFoundMatches] = useState([]);
//     const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  
//     const handleSearch = async () => {
//       if (!pdfDocument || !searchTerm) return;
//       let matches = [];
  
//       for (let i = 1; i <= numPages; i++) {
//         const page = await pdfDocument.getPage(i);
//         const textContent = await page.getTextContent();
        
//         let matchIndices = [];
//         let fullText = "";
//         let textPositions = [];
  
//         textContent.items.forEach((item, index) => {
//           fullText += item.str + " ";
//           textPositions.push({ text: item.str, bbox: item.transform, index });
//         });
  
//         let searchRegex = new RegExp(searchTerm, "gi");
//         let match;
//         while ((match = searchRegex.exec(fullText)) !== null) {
//           matchIndices.push({ page: i, index: match.index });
//         }
  
//         matchIndices.forEach(({ page, index }) => {
//           const matchedItem = textPositions.find((t) => fullText.indexOf(t.text) === index);
//           if (matchedItem) {
//             matches.push({ page, bbox: matchedItem.bbox });
//           }
//         });
//       }
  
//       setFoundMatches(matches);
//       setCurrentMatchIndex(0);
//       if (matches.length > 0) scrollToMatch(0);
//     };
  
//     const scrollToMatch = (matchIndex) => {
//       if (foundMatches.length === 0) return;
//       setCurrentMatchIndex(matchIndex);
//       const match = foundMatches[matchIndex];
//       const pageElement = document.querySelector(`[data-page-number='${match.page}']`);
  
//       if (pageElement) {
//         pageElement.scrollIntoView({ behavior: "smooth", block: "center" });
//       }
//     };
  
//     return (
//       <div className="p-4">
//         <div className="flex gap-2 mb-4">
//           <Input
//             type="text"
//             placeholder="Search text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <Button onClick={handleSearch}>Search</Button>
//         </div>
  
//         {foundMatches.length > 0 && (
//           <div className="flex gap-2 items-center">
//             <Button onClick={() => scrollToMatch(Math.max(0, currentMatchIndex - 1))}>Prev</Button>
//             <span>
//               {currentMatchIndex + 1} / {foundMatches.length}
//             </span>
//             <Button onClick={() => scrollToMatch(Math.min(foundMatches.length - 1, currentMatchIndex + 1))}>
//               Next
//             </Button>
//           </div>
//         )}
  
//         {foundMatches.map((match, index) => (
//           <div
//             key={index}
//             className="absolute bg-yellow-300 opacity-50"
//             style={{
//               left: `${match.bbox[4]}px`,
//               top: `${match.bbox[5]}px`,
//               width: "100px",
//               height: "20px",
//             }}
//           />
//         ))}
//       </div>
//     );
//   }