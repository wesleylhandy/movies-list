import { classNames } from '../utils/class-names';
import React from 'react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { SliderNavigationDirection } from '../utils/slider-navigation-direction';

export interface SliderNavigationPadProps {
    ariaControls: string;
    direction: SliderNavigationDirection;
    isDisabled?: boolean;
    onClick: (direction: SliderNavigationDirection) => void;
    onKeyDown: (event: React.KeyboardEvent<any>) => void;
    testId?: string;
}

const defaultProps: Pick<SliderNavigationPadProps, 'isDisabled' | 'testId'> = {
    isDisabled: false,
    testId: undefined,
};

export function SliderNavigationPad(props: SliderNavigationPadProps): JSX.Element {
    const { ariaControls, direction, isDisabled, onClick, onKeyDown, testId } = props;

    function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        onClick(direction);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>): void {
        onKeyDown(event);
    }

    return (
        <button
            aria-controls={ariaControls}
            aria-label={`${direction} Slide`}
            className={classNames(
                [
                    'flex flex-row justify-center items-center',
                    'h-60 px-3 border-0 rounded-none',
                    'transition-colors motion-reduce:transition-none',
                ],
                {
                    'bg-gray-light text-gray-800  duration-200 hover:bg-gray-800 hover:text-gray-light': !isDisabled,
                    'bg-lightest text-gray-300 cursor-not-allowed': Boolean(isDisabled),
                    'mr-3': direction === SliderNavigationDirection.Previous,
                    'ml-3': direction === SliderNavigationDirection.Next,
                },
            )}
            data-testid={testId}
            disabled={isDisabled}
            type="button"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            {direction === SliderNavigationDirection.Previous ? (
                <MdNavigateBefore className="h-full w-12" />
            ) : (
                <MdNavigateNext className="h-full w-12" />
            )}
        </button>
    );
}

SliderNavigationPad.defaultProps = defaultProps;