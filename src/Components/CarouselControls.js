import { useState, useEffect, useCallback } from "react";

export default function CarouselControls({ index = 0, itemIndex = 0, numItems = 3, transitionTime = 500, visibleItems = 1, allowLooping = true, disableOnTransition = true, infiniteMode = false, onIndexChange }) {
    const [currentIndex, setCurrentIndex] = useState(itemIndex);
    const [disabled, setDisabled] = useState(false);

    const minBackIndex = infiniteMode ? visibleItems : 0;
    const maxBackIndex = infiniteMode ? numItems + visibleItems - 1 : numItems - 1;

    const updateIndex = useCallback((index) => {
        index = infiniteMode ? index : index % numItems;
        index = index < 0 ? (!infiniteMode ? numItems - 1 : numItems + visibleItems) : index;
        setCurrentIndex(!infiniteMode ? index : 
            (index < visibleItems ? visibleItems + numItems - 1 : 
                (index >= numItems + visibleItems ? visibleItems : index )
            )
        );
        onIndexChange && onIndexChange(index, !infiniteMode ? index : ((index - visibleItems) % numItems + numItems) % numItems);
        if (disableOnTransition && transitionTime) {
            setDisabled(true);
            setTimeout(() => setDisabled(false), transitionTime);
        }
    }, [infiniteMode, numItems, visibleItems, onIndexChange]);

    useEffect(() => {
        const indexOffset = !infiniteMode ? 0 : visibleItems;
        const firstIndex = index == null ? itemIndex + indexOffset : Math.max(index, indexOffset);
        updateIndex(firstIndex);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        let nextIndex;
        if (!infiniteMode) {
            nextIndex = itemIndex === currentIndex ? index : itemIndex;
        } else {
            nextIndex = (index !== currentIndex) ? index : itemIndex + visibleItems;
        }
        const currentIndexComparisons = [currentIndex];
        if (infiniteMode) {
            if (currentIndex === visibleItems) { // at first item so could be incoming wraparound
                currentIndexComparisons.push(numItems + visibleItems);
            } else if (currentIndex === numItems + visibleItems - 1) { // at last item
                currentIndexComparisons.push(visibleItems - 1);
            }
        }
        if (currentIndexComparisons.indexOf(nextIndex) > -1) return;
        updateIndex(nextIndex);
    }, [index, itemIndex, updateIndex]); 

    return (
        <div className="carouselControls">
           { (infiniteMode || allowLooping || currentIndex > minBackIndex) && <button onClick={() => updateIndex(currentIndex - 1)} disabled={disabled}>&lt;</button> }
           { (infiniteMode || allowLooping || currentIndex < maxBackIndex) &&<button onClick={() => updateIndex(currentIndex + 1)} disabled={disabled}>&gt;</button> }
        </div>
    )
}
