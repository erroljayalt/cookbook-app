'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface RecipeNavigationProps {
    prevId: number;
    nextId: number;
}

export default function RecipeNavigation({ prevId, nextId }: RecipeNavigationProps) {
    const router = useRouter();
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null); // Reset touch end
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            // Swipe Left -> Next Recipe
            router.push(`/recipes/${nextId}`);
        } else if (isRightSwipe) {
            // Swipe Right -> Previous Recipe
            router.push(`/recipes/${prevId}`);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                router.push(`/recipes/${prevId}`);
            } else if (e.key === 'ArrowRight') {
                router.push(`/recipes/${nextId}`);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [prevId, nextId, router]);

    return (
        <div
            className={styles.navigationOverlay}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Desktop Navigation Buttons */}
            <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={() => router.push(`/recipes/${prevId}`)}
                aria-label="Previous Recipe"
            >
                ←
            </button>
            <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={() => router.push(`/recipes/${nextId}`)}
                aria-label="Next Recipe"
            >
                →
            </button>
        </div>
    );
}
