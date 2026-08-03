import { AppProviders } from "./providers/AppProviders";
import { AppLayout } from "./components/layout/AppLayout";
import { SectionRenderer } from "./components/layout/SectionRenderer";

function App() {
  return (
    <AppProviders>
      <AppLayout>
        <SectionRenderer />
      </AppLayout>
    </AppProviders>
  );
}

export default App;
