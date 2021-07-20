import { useState } from "react";

export default function CarouselControls({ index = 0, transitionTime = 500, visibleItems = 1, onIndexChange }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const updateIndex = (index) => {
        setCurrentIndex(index);
        onIndexChange && onIndexChange(index);
    }

    return (
        <div className="carouselControls">
           <button onClick={() => updateIndex(currentIndex - 1)}>&lt;</button>
           <button onClick={() => updateIndex(currentIndex + 1)}>&gt;</button>
        </div>
    )
}
