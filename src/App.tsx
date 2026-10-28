import { useRef, useEffect } from 'react';
import WebViewer, { type WebViewerInstance } from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const viewerElement = viewer.current;
    if (!viewerElement) return;

    let isUnmounted = false;
    let webViewerInstance: WebViewerInstance | null = null;

    WebViewer(
      {
        path: '/lib/webviewer',
        fullAPI: true,
        loadAsPDF: true,
        licenseKey: import.meta.env.VITE_DEMO_KEY,  // sign up to get a free trial key at https://dev.apryse.com
      },
      viewerElement,
    ).then((instance: WebViewerInstance) => {
      if (isUnmounted) {
        instance.UI.dispose();
        return;
      }

      webViewerInstance = instance;
      instance.UI.enableFeatures([
        instance.UI.Feature.SideBySideView,
        instance.UI.Feature.ComparePages,
      ]);
      instance.UI.enterMultiViewerMode();
      const header = instance.UI.getModularHeader('default-top-header');
      const compareButton = new instance.UI.Components.PresetButton({
        buttonType: 'compareButton',
        dataElement: 'native-compare-button',
        label: 'Compare',
        title: 'Compare documents',
      });
      header.setItems([...header.getItems(), compareButton]);

    });

    return () => {
      isUnmounted = true;

      if (webViewerInstance) {
        webViewerInstance.UI.dispose();
      }
    };
  }, []);

  return (
    <div className="App">
      <div className="header">React sample</div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
