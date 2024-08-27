import ReactDOM from 'react-dom/client';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';
import LanguageProvider from './contexts/LanguageContext.tsx';
  const clientId = '807927721275-1qj7a4riq46fhg9ii893hmulg987tds0.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <GoogleOAuthProvider clientId={clientId}>
        <App />
    </GoogleOAuthProvider>
  </LanguageProvider>,
);
