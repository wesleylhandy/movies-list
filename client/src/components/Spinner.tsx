import { MdRefresh } from 'react-icons/md';

export interface SpinnerProps {
    isActive: boolean;
}

export function Spinner(props: SpinnerProps): JSX.Element | null {
    const { isActive } = props;

    if (!isActive) return null;

    return (
        <div className="sticky top-0 left-0 right-0 bottom-0 z-10">
            <MdRefresh aria-label="Wait for Data to Load" className="motion-safe:animate-spin h-12 w-12 text-gray-300 absolute top-auto left-auto right-auto bottom-auto"/>
        </div>
    )
}
