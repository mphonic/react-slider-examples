import { useState, useEffect, useRef } from "react";
import "./Carousel.css";

export default function CarouselTrack({ children, index = 0, visibleItems = 1, transitionTime = 500 }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [offset, setOffset] = useState(0);

    const items = useRef([]);

    useEffect(() => {
        if (index === undefined || index === currentIndex) return;
        performTransition(index);
    }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

    let referenceIndex = -1;

    const getOffset = (index) => {
        return items.current
            .slice(0, index)
            .map(e => e.clientWidth)
            .reduce((a, b) => a + b, 0) * -1;
    }

    const performTransition = (newIndex) => {
        setOffset(getOffset(newIndex));
        setCurrentIndex(newIndex);
    }

    const renderItem = (item) => {
        const index = ++referenceIndex;
        return (
            <div
                ref={(e) => items.current[index] = e}
                key={`carousel-item-${index}`}
                className={`carouselItem${currentIndex === index ? ' selected' : ''}`}
                style={{ flexBasis: `${1 / visibleItems * 100}%` }}
            >
                {item}
            </div>
        )
    }

    return (
        <div className="carouselTrackWrapper">
            <div className="carouselTrack" style={{ transform: `translate3d(${offset}px, 0, 0)`, transitionDuration: `${transitionTime}ms`}}>
                { children.map((e, c) => renderItem(e)) }
            </div>
        </div>
    )
}
