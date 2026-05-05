import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { SiteConfigProvider } from "./contexts/SiteConfigContext";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <SiteConfigProvider>
        <BrowserRouter basename={__BASE_PATH__}>
          <AppRoutes />
        </BrowserRouter>
      </SiteConfigProvider>
    </I18nextProvider>
  );
}

export default App;
