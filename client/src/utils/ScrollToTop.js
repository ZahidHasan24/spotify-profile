import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll to top of page when changing routes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
