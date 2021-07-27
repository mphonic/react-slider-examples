import { useState, useEffect } from "react";

export default function CarouselControls({ index = 0, numItems = 3, transitionTime = 500, visibleItems = 1, infiniteMode = false, onIndexChange }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const indexOffset = !infiniteMode ? 0 : visibleItems;
        const firstIndex = indexOffset;
        updateIndex(firstIndex);
    }, []);

    const updateIndex = (index) => {
        index = infiniteMode ? index : index % numItems;
        index = index < 0 ? (!infiniteMode ? numItems - 1 : numItems + visibleItems) : index;
        setCurrentIndex(!infiniteMode ? index :
            (index < visibleItems ? visibleItems + numItems - 1 :
                (index >= numItems + visibleItems ? visibleItems : index)));
        onIndexChange && onIndexChange(index);
    }

    return (
        <div className="carouselControls">
           <button onClick={() => updateIndex(currentIndex - 1)}>&lt;</button>
           <button onClick={() => updateIndex(currentIndex + 1)}>&gt;</button>
        </div>
    )
}
