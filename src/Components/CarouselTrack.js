import { useState, useEffect, useRef, useCallback } from "react";
import "./Carousel.css";

export default function CarouselTrack({ children, index = 0, itemIndex = 0, visibleItems = 1, infiniteMode = false, transitionTime = 500, onIndexChange }) {
    const [currentIndex, _setCurrentIndex] = useState(0);
    const [offset, setOffset] = useState(0);
    const [animate, setAnimate] = useState(true);

    const items = useRef([]);
    const currentIndexRef = useRef(currentIndex);
    const timeout = useRef(null);
    const hasLoaded = useRef(false);

    const setCurrentIndex = (index) => {
        currentIndexRef.current = index;
        _setCurrentIndex(index);
    }

    const getOffset = useCallback((index) => {
        return items.current
            .slice(0, index)
            .map(e => e.clientWidth)
            .reduce((a, b) => a + b, 0) * -1;
    }, [items]);

    const getWraparoundIndex = useCallback((index) => {
        return index < visibleItems ? children.length + visibleItems - 1 : visibleItems;
    }, [visibleItems, children]);

    const doesIndexRequireSwap = useCallback((index) => {
        return infiniteMode && (index < visibleItems || index >= children.length + visibleItems);
    }, [infiniteMode, visibleItems, children]);

    const performTransition = useCallback((newIndex, doAnimate = true) => {
        // const nextIndex = getWraparoundIndex(newIndex);
        const needsSwap = doesIndexRequireSwap(newIndex);
        const nextIndex = needsSwap ? getWraparoundIndex(newIndex) : newIndex;
        // console.log('performing transition', newIndex, nextIndex, needsSwap);

        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = null;
            if (doesIndexRequireSwap(currentIndex)) {
                setAnimate(false);
                const index = getWraparoundIndex(currentIndex);
                setCurrentIndex(index);
                setOffset(getOffset(index));
                setTimeout(() => performTransition(newIndex, doAnimate));
                return;
            }
        }

        setAnimate(doAnimate);

        if (needsSwap) {
            setCurrentIndex(newIndex);
            setOffset(getOffset(newIndex));
            timeout.current = setTimeout(() => {
                performTransition(nextIndex, false);
                timeout.current = null;
            }, transitionTime);
            return;
        }

        setOffset(getOffset(nextIndex));
        setCurrentIndex(nextIndex);
        onIndexChange && onIndexChange(nextIndex, !infiniteMode ? nextIndex : nextIndex - visibleItems);
    }, [infiniteMode, visibleItems, getWraparoundIndex, getOffset, doesIndexRequireSwap, onIndexChange, transitionTime]);

    useEffect(() => {
        const indexOffset = !infiniteMode ? 0 : visibleItems;
        const firstIndex = index == null ? itemIndex + indexOffset : Math.max(index, indexOffset);
        performTransition(firstIndex, false);

        let debounceTimeout = null;
        const windowResizeAdjustment = () => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => performTransition(currentIndexRef.current, false), 150);
        }
        window.addEventListener('resize', windowResizeAdjustment);
        return () => {
            window.removeEventListener('resize', windowResizeAdjustment)
        }
    }, []);

    useEffect(() => {
        if (!hasLoaded.current) {
            hasLoaded.current = true;
            return;
        }
        let nextIndex;
        if (!infiniteMode) {
            nextIndex = itemIndex === currentIndex ? index : itemIndex;
        } else {
            nextIndex = (index !== currentIndex) ? index : itemIndex + visibleItems;
        }
        if (nextIndex === currentIndex) return;
        performTransition(nextIndex);
    }, [index, itemIndex, performTransition]);

    let referenceIndex = -1;

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
        const childrenClone = lower ? [ ...children].reverse().slice(0, visibleItems).reverse() : children;
        for (let i = 0; i < visibleItems; i++) {
            items.push(renderItem(childrenClone[i]));
        }
        return items;
    }

    return (
        <div className="carouselTrackWrapper">
            <div className="carouselTrack" style={{ transform: `translate3d(${offset}px, 0, 0)`, transitionDuration: `${animate ? transitionTime : 0}ms`, visibility: hasLoaded.current ? 'visible' : 'hidden'}}>
                { infiniteMode && renderClones(true) }
                { children.map((e, c) => renderItem(e)) }
                { infiniteMode && renderClones(false) }
            </div>
        </div>
    )
}
