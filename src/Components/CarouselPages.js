import { useState, useEffect } from "react";

export default function CarouselPages({ numItems, itemIndex = 0, children, onItemIndexChange }) {
    const [currentIndex, setCurrentIndex] = useState(itemIndex);

    useEffect(() => {
        if (itemIndex === currentIndex) return;
        updateIndex(itemIndex);
    }, [itemIndex]);

    const updateIndex = (index) => {
        if (index === currentIndex) return;
        setCurrentIndex(index);
        onItemIndexChange && onItemIndexChange(index);
    }

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

    return (
        <div className="carouselThumbnails">
            {
                children.map((e, c) => (
                    <div
                        key={`carousel-thumbnail-${c}`}
                        className={`carouselThumbnail${currentIndex === c ? ' selected' : ''}`}
                        onClick={(event) => updateIndex(c)}
                    >
                        {e}
                    </div>
                ))
            }
        </div>
    )
}