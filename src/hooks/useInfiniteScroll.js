import { useEffect, useRef, useState } from 'react';

const useInfiniteScroll = (loadMore, hasMore) => {
  const observerRef = useRef(null);
  const [lastElement, setLastElement] = useState(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (lastElement) observerRef.current.observe(lastElement);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [lastElement, hasMore, loadMore]);

  return [setLastElement];
};

export default useInfiniteScroll;
