import { isPresent } from '../utils/value';
import { SliderNavigationDirection } from './slider-navigation-direction';

interface ScrollArguments {
    sliderOuterContainer: React.MutableRefObject<HTMLDivElement | null>;
    sliderInnerContainer: React.MutableRefObject<HTMLDivElement | null>;
    direction: SliderNavigationDirection;
    distance: number;
    step?: number;
}

export function sliderScroll({
    sliderInnerContainer,
    sliderOuterContainer,
    direction,
    distance,
    step = 20,
}: ScrollArguments): void {
    if (!isPresent(sliderOuterContainer.current) || !isPresent(sliderInnerContainer.current)) {
        return;
    }
    const scrollWidth = sliderInnerContainer.current.offsetWidth - sliderOuterContainer.current.offsetWidth;
    const shouldScroll = scrollWidth > 0;
    let scrollAmount = 0;

    function scroll(timeout: number) {
        if (!isPresent(sliderOuterContainer.current) || !isPresent(sliderInnerContainer.current)) {
            return cancelAnimationFrame(timeout);
        }

        if (direction === SliderNavigationDirection.Previous) {
            /* eslint-disable no-param-reassign */
            sliderOuterContainer.current.scrollLeft -= step;
        } else {
            sliderOuterContainer.current.scrollLeft += step;
        }
        scrollAmount += step;
        if (scrollAmount >= distance) {
            cancelAnimationFrame(timeout);
        } else {
            timeout = requestAnimationFrame(scroll);
        }
    }

    if (shouldScroll) {
        requestAnimationFrame(scroll);
    }
}