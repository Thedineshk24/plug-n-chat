import { useEffect } from 'react';
const usePopupDimensions = () => {
  useEffect(() => {
    if (browser.windows && browser.windows.WINDOW_ID_CURRENT) {
      browser.windows.update(browser.windows.WINDOW_ID_CURRENT, {
        width: 384,
        height: 600,
      });
    }
  }, []);
};

export default usePopupDimensions;
