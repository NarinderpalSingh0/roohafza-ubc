import { useState, useCallback } from "react";
import { AppProviders } from "./providers/AppProviders";
import { AppLayout } from "./components/layout/AppLayout";
import { SectionRenderer } from "./components/layout/SectionRenderer";
import Preloader from "./components/ui/Preloader";
import ProgressIndicator from "./components/ui/ProgressIndicator";

function App() {
  const [loaded, setLoaded] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <AppProviders>
      {!loaded && <Preloader onComplete={handlePreloaderComplete} />}
      <ProgressIndicator />
      <AppLayout>
        <SectionRenderer />
      </AppLayout>
    </AppProviders>
  );
}

export default App;
