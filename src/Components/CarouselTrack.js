import { useState, useEffect, useRef } from "react";
import "./Carousel.css";

export default function CarouselTrack({ children, index = 0, visibleItems = 1, infiniteMode = false, transitionTime = 500 }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [offset, setOffset] = useState(0);
    const [animate, setAnimate] = useState(true);

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

    const getWraparoundIndex = (index) => {
        return index < visibleItems ? children.length + visibleItems - 1 : visibleItems;
    }

    const doesIndexRequireSwap = (index) => {
        return infiniteMode && (index < visibleItems || index >= children.length + visibleItems);
    }

    const performTransition = (newIndex, doAnimate = true) => {
        // const nextIndex = getWraparoundIndex(newIndex);
        const needsSwap = doesIndexRequireSwap(newIndex);
        const nextIndex = needsSwap ? getWraparoundIndex(newIndex) : newIndex;
        // console.log('performing transition', newIndex, nextIndex, needsSwap);
        setAnimate(doAnimate);

        if (needsSwap) {
            setCurrentIndex(newIndex);
            setOffset(getOffset(newIndex));
            setTimeout(() => {
                performTransition(nextIndex, false);
            }, transitionTime);
            return;
        }

        setOffset(getOffset(nextIndex));
        setCurrentIndex(nextIndex);
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

    const renderClones = (lower = true) => {
        const items = [];
        for (let i = 0; i < visibleItems; i++) {
            if (lower) {
                items.push(renderItem(children[children.length - visibleItems - i]));
            } else {
                items.push(renderItem(children[i]));
            }
        }
        return items;
    }

    return (
        <div className="carouselTrackWrapper">
            <div className="carouselTrack" style={{ transform: `translate3d(${offset}px, 0, 0)`, transitionDuration: `${animate ? transitionTime : '0'}ms`}}>
                { infiniteMode && renderClones(true) }
                { children.map((e, c) => renderItem(e)) }
                { infiniteMode && renderClones(false) }
            </div>
        </div>
    )
}
