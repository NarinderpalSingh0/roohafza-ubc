import { useState, useCallback, useRef } from "react";
import { AppProviders } from "./providers/AppProviders";
import { AppLayout } from "./components/layout/AppLayout";
import { SectionRenderer } from "./components/layout/SectionRenderer";
import Preloader from "./components/ui/Preloader";
import ProgressIndicator from "./components/ui/ProgressIndicator";
import AmbientSound from "./components/ui/AmbientSound";

function App() {
  const [loaded, setLoaded] = useState(false);
  const ambientRef = useRef<{ start: () => void }>(null);

  const handlePreloaderComplete = useCallback(() => {
    setLoaded(true);
    // Auto-start ambient sound after preloader
    setTimeout(() => {
      ambientRef.current?.start();
    }, 500);
  }, []);

  return (
    <AppProviders>
      {!loaded && <Preloader onComplete={handlePreloaderComplete} />}
      <ProgressIndicator />
      <AmbientSound ref={ambientRef} autoStart={false} />
      <AppLayout>
        <SectionRenderer />
      </AppLayout>
    </AppProviders>
  );
}

export default App;
