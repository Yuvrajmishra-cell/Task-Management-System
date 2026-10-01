import { useEffect } from "react";

/**
 * Custom hook to update document title per route.
 * Automatically appends " | TaskFlow" unless already present.
 */
export function usePageTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = title.includes("TaskFlow")
        ? title
        : `${title} | TaskFlow`;
    }
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}

export default usePageTitle;
