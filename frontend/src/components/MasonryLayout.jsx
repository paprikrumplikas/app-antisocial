import React, { useRef, useEffect, useState } from 'react';
import Masonry from "react-masonry-css";
import Pin from "./Pin";

const getColumnsForWidth = (width) => {
    if (width < 480) return 1;
    if (width < 700) return 2;
    if (width < 850) return 3;
    if (width < 1300) return 4;
    if (width < 1600) return 5;
    return 6;
};

// @note rendered by Feed
const MasonryLayout = ({ pins }) => {
    const containerRef = useRef(null);
    const [columns, setColumns] = useState(4);

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            const width = entries[0].contentRect.width;
            setColumns(getColumnsForWidth(width));
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className='w-full'>
            <Masonry
                className='flex animate-slide-fwd w-full'
                breakpointCols={columns}
            >
                {pins?.map((pin) => (
                    <Pin
                        key={pin._id}
                        pin={pin}
                        className="w-max"
                    />
                ))}
            </Masonry>
        </div>
    );
};

export default MasonryLayout;