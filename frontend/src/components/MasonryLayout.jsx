import React, { useRef, useEffect, useState } from 'react';
import Masonry from "react-masonry-css";
import Pin from "./Pin";

const getColumnsForWidth = (width) => {
    if (width < 500) return 3;
    if (width < 800) return 4;
    if (width < 1200) return 5;
    if (width < 1600) return 6;
    return 7;
};

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
        <div ref={containerRef}>
            <Masonry
                className='flex animate-slide-fwd'
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