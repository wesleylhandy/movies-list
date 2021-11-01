import React, { ReactNode, useRef } from 'react';
import { SliderNavigationDirection } from '../utils/slider-navigation-direction';
import { SliderNavigationPad } from './SliderNavigationPad';
import { sliderScroll } from '../utils/slider-scroll';
import { isPresent } from "../utils/value";

export interface SliderProps {
    ariaLabel: string;
    carouselId: string;
    canSlidePrev: boolean;
    canSlideNext: boolean;
    isLoading: boolean;
    onFocus?: () => void;
    onSlide: (direction: SliderNavigationDirection, isAll?: boolean) => void;
    slideWidth: number;
    title?: string;
    children?: ReactNode;
    testId?: string;
}

const carouselDefaultProps: Pick<SliderProps, 'children' | 'testId' | 'onFocus' | 'title'> = {
    children: undefined,
    onFocus: () => undefined,
    testId: 'slider-carousel',
    title: undefined,
};

export function MovieSlider(props: SliderProps): JSX.Element | null {
    const {
        ariaLabel,
        canSlidePrev,
        canSlideNext,
        carouselId,
        isLoading,
        onFocus,
        onSlide,
        slideWidth,
        children,
        testId,
        title
    } = props;
    
    const sliderOuterContainer = useRef<HTMLDivElement>(null);
    const sliderInnerContainer = useRef<HTMLDivElement>(null);

    function handleDirectionPadClick(direction: SliderNavigationDirection) {
        onSlide(direction);
        sliderScroll({ sliderInnerContainer, sliderOuterContainer, direction, distance: slideWidth });
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        if (isLoading) return
        if (!isPresent(sliderOuterContainer.current) || !isPresent(sliderInnerContainer.current)) {
            return;
        }
        const scrollPosition = sliderOuterContainer.current.scrollLeft;
        const scrollWidth = sliderInnerContainer.current.offsetWidth - sliderOuterContainer.current.offsetWidth;
        switch (event.key) {
            case 'Tab':
            case 'ArrowRight':
                if (canSlideNext) {
                    onSlide(SliderNavigationDirection.Next);
                    sliderScroll({
                        sliderInnerContainer,
                        sliderOuterContainer,
                        direction: SliderNavigationDirection.Next,
                        distance: slideWidth,
                    });
                }
                break;
            case 'ArrowLeft':
                if (canSlidePrev) {
                    onSlide(SliderNavigationDirection.Previous);
                    sliderScroll({
                        sliderInnerContainer,
                        sliderOuterContainer,
                        direction: SliderNavigationDirection.Previous,
                        distance: slideWidth,
                    });
                }
                break;
            case 'Home':
                onSlide(SliderNavigationDirection.Previous, true);
                sliderScroll({
                    sliderInnerContainer,
                    sliderOuterContainer,
                    direction: SliderNavigationDirection.Previous,
                    distance: scrollPosition,
                    step: slideWidth,
                });
                break;
            case 'End':
                onSlide(SliderNavigationDirection.Next, true);
                sliderScroll({
                    sliderInnerContainer,
                    sliderOuterContainer,
                    direction: SliderNavigationDirection.Next,
                    distance: scrollWidth - scrollPosition,
                    step: slideWidth,
                });
                break;
            default:
                break;
        }
    }

    function handleFocus(_event: React.FocusEvent<HTMLDivElement>) {
        if (isPresent(onFocus)) onFocus();
    }

    if (typeof children === 'undefined') {
        return null;
    }

    return (
        <section className="bg-transparent my-8 flex-grow" data-testid={testId}>
            {title && <h3 className="text-center uppercase mb-5 text-3xl">{title}</h3>}
            <div className="carousel relative flex flex-row items-center h-full">
                <SliderNavigationPad
                    ariaControls={carouselId}
                    direction={SliderNavigationDirection.Previous}
                    isDisabled={!canSlidePrev || isLoading}
                    onClick={handleDirectionPadClick}
                    onKeyDown={handleKeyDown}
                />
                <div
                    ref={sliderOuterContainer}
                    className="carousel-outer relative overflow-y-hidden overflow-x-scroll w-full h-full flex"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                >
                    <div
                        ref={sliderInnerContainer}
                        aria-live="polite"
                        className="carousel-inner relative flex "
                        role="region"
                        aria-roledescription="carousel"
                        aria-label={ariaLabel}
                        tabIndex={0}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                    >
                        {children}
                    </div>
                </div>
                <SliderNavigationPad
                    ariaControls={carouselId}
                    direction={SliderNavigationDirection.Next}
                    isDisabled={!canSlideNext || isLoading}
                    onClick={handleDirectionPadClick}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </section>
    );
}

MovieSlider.defaultProps = carouselDefaultProps;
