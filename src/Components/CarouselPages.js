import { useState, useEffect, useCallback } from "react";

export default function CarouselPages({ numItems, itemIndex = 0, children, onItemIndexChange }) {
    const [currentIndex, setCurrentIndex] = useState(itemIndex);

    const updateIndex = useCallback((index) => {
        if (index === currentIndex) return;
        setCurrentIndex(index);
        onItemIndexChange && onItemIndexChange(index);
    }, [onItemIndexChange]);

    const renderItem = useCallback((item, index) => {
        return (
            <div 
                key={`carousel-thumbnail-${index}`}
                className={`carouselThumbnail${currentIndex === index ? ' selected' : ''}`}
                onClick={(event) => updateIndex(index)}
            >
                {item}
            </div>
        )
    }, [currentIndex]);
    
    useEffect(() => {
        if (itemIndex === currentIndex) return;
        updateIndex(itemIndex);
    }, [itemIndex, updateIndex]);

    if (!children || !children.length) return (
        <div className="carouselPages">
            {
                [...Array(numItems).keys()].map((_, c) => (
                    <div 
                        key={`carousel-page-${c}`}
                        className={`carouselPage${currentIndex === c ? ' selected' : ''}`}
                        onClick={(event) => updateIndex(c)}
                    >
                        o
                    </div>
                ))
            }
        </div>
    )

    // if there are children, treat as thumbnails

    return (
        <div className="carouselThumbnails">
            {
                children.map((e, c) => renderItem(e, c))
            }
        </div>
    )
}