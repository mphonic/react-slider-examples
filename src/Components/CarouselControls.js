import { useState, useEffect } from "react";

export default function CarouselControls({ index = 0, itemIndex = 0, numItems = 3, transitionTime = 500, visibleItems = 1, disableOnTransition = true, infiniteMode = false, onIndexChange }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);

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
            if (currentIndex === visibleItems) {
                currentIndexComparisons.push(numItems + visibleItems);
            } else if (currentIndex === numItems + visibleItems - 1) { // at the last item
                currentIndexComparisons.push(visibleItems - 1);
            }
        }
        if (currentIndexComparisons.indexOf(nextIndex) > -1) return;
        updateIndex(nextIndex);
    }, [index, itemIndex]);

    const updateIndex = (index) => {
        index = infiniteMode ? index : index % numItems;
        index = index < 0 ? (!infiniteMode ? numItems - 1 : numItems + visibleItems) : index;
        setCurrentIndex(!infiniteMode ? index :
            (index < visibleItems ? visibleItems + numItems - 1 :
                (index >= numItems + visibleItems ? visibleItems : index)));
        onIndexChange && onIndexChange(index);
        if (!disableOnTransition) return;
        setIsDisabled(true);
        setTimeout(() => setIsDisabled(false), transitionTime);
    }

    return (
        <div className="carouselControls">
           <button onClick={() => updateIndex(currentIndex - 1)} disabled={isDisabled}>&lt;</button>
           <button onClick={() => updateIndex(currentIndex + 1)} disabled={isDisabled}>&gt;</button>
        </div>
    )
}
