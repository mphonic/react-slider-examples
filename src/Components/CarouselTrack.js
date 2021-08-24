import { useState, useEffect, useRef, useCallback } from "react";
import { useSwipeable } from "react-swipeable";

import "./Carousel.css";

export default function CarouselTrack({ 
    children, 
    index = 0,
    itemIndex = 0, 
    transitionTime = 300, 
    visibleItems = 1, 
    infiniteMode = false,
    centerMode = false, 
    centerWidth = 1,
    onIndexChange,
    onItemClick,
    onItemHover,
    onItemUnHover 
    }) {
    const [currentIndex, _setCurrentIndex] = useState(index);
    const [offset, setOffset] = useState(0);
    const [animate, setAnimate] = useState(false);

    const currentIndexRef = useRef(currentIndex);
    const items = useRef([]);
    const hasLoaded = useRef(false);
    const timeout = useRef();

    const setCurrentIndex = (index) => {
        currentIndexRef.current = index;
        _setCurrentIndex(index);
    }

    // begin slide transition functions
    const getOffset = useCallback((index) => {
        return items.current
            .slice(0, index)
            .map(e => e.clientWidth)
            .reduce((a, b) => a + b, 0) * -1;
    }, []);

    const doesIndexRequireSwap = useCallback((index) => {
        return infiniteMode && (index < visibleItems || index >= children.length + visibleItems);
    }, [infiniteMode, visibleItems, children]);

    const getWraparoundIndex = useCallback((index) => {
        return index < visibleItems ? children.length + visibleItems - 1 : visibleItems;
    }, [visibleItems, children]);

    const performTransition = useCallback((newIndex, doAnimate = true) => {
        const needsSwap = doesIndexRequireSwap(newIndex);

        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = null;
            if (doesIndexRequireSwap(currentIndex)) { // handle infinite wraparound interruptions
                setAnimate(false);
                const index = getWraparoundIndex(currentIndex);
                setCurrentIndex(index);
                setOffset(getOffset(index));
                setTimeout(() => performTransition(newIndex, doAnimate));
                return;
            }
        }

        const nextIndex = needsSwap ? getWraparoundIndex(newIndex) : newIndex;

        setAnimate(doAnimate);

        if (needsSwap) { // performing infinite wraparound
            setCurrentIndex(newIndex);
            setOffset(getOffset(newIndex));
            timeout.current = setTimeout(() => {
                timeout.current = null;
                performTransition(nextIndex, false);
            }, transitionTime);
            // onIndexChange && onIndexChange(newIndex, nextIndex - visibleItems);
            return;
        }

        setCurrentIndex(nextIndex);
        setOffset(getOffset(nextIndex));
        onIndexChange && onIndexChange(nextIndex, !infiniteMode ? nextIndex : nextIndex - visibleItems);
    }, [infiniteMode, visibleItems, transitionTime]);
    // end slide transition functions

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
            window.removeEventListener('resize', windowResizeAdjustment);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        performTransition(nextIndex, true); 
    }, [index, itemIndex, infiniteMode, performTransition]);

    // swipeable hook
    const handlers = useSwipeable({
        onSwipedLeft: (e) => performTransition(currentIndex + 1),
        onSwipedRight: (e) => performTransition(currentIndex - 1),
        trackMouse: true
    });

    // rendering items redefined each state change to get indexes right
    let referenceIndex = -1;

    const renderItem = (item) => {
        const index = ++referenceIndex;
        const cssClass = ['carouselItem'];
        if (currentIndex === index) cssClass.push('selected');
        return (
            <div 
                ref={(e) => items.current[index] = e}
                key={`carousel-item-${index}`} 
                className={cssClass.join(' ')}
                style={{
                    flexBasis: `${1 / visibleItems * 100}%`
                }}
                onClick={(e) => onItemClick && onItemClick(index)}
                onMouseOver={(e) => onItemHover && onItemHover(index)}
                onMouseOut={(e) => onItemUnHover && onItemUnHover(index)}
                >
                {item}
            </div>
        )
    };

    const renderClones = useCallback((lower = true) => {
        const items = [];
        const childrenClone = lower ? [ ...children].reverse().slice(0, visibleItems).reverse() : children;
        for (let i = 0; i < visibleItems; i++) {
            items.push(renderItem(childrenClone[i]));
        }
        return items;
    }, [renderItem]);

    // check for issues
    if (!children || !children.length) return '';

    if (visibleItems > children.length) {
        visibleItems = children.length;
        console.error("Carousel Track: Visible items cannot exceed the number of children.");
    }

    return (
        <div {...handlers} className="carouselTrackWrapper">
            <div className="carouselTrack" style={{ transform: `translate3d(${offset}px, 0, 0)`, transitionDuration: `${animate ? transitionTime : 0}ms`, visibility: hasLoaded.current ? 'visible' : 'hidden'}}>
                { infiniteMode && renderClones(true) }
                { children.map((e, c) => renderItem(e)) }
                { infiniteMode && renderClones(false) }
            </div>
        </div>
    )
}
