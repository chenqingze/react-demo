import './global.css';
import ThemeProvider from './theme';
import Router from './routes/sections';
import ProgressBar from './components/progress-bar';
import { AuthProvider } from './auth/context/session';
import { SnackbarProvider } from './components/snackbar';
import { useScrollToTop } from './hooks/use-scroll-to-top';
import { MotionLazy } from './components/animate/motion-lazy';
import { SettingsDrawer, SettingsProvider } from './components/settings';

function App() {
  const charAt = `

  ╔═╗┌─┐┌┬┐┌─┐┬ ┬┌─┐┌┐┌┬ ┬  ╔═╗┌─┐┌┬┐┌┬┐┌─┐┬─┐┌─┐┌─┐
  ╠╣ ├─┤│││├─┘├─┤│ ││││└┬┘  ║  │ │││││││├┤ ├┬┘│  ├┤
  ╚  ┴ ┴┴ ┴┴  ┴ ┴└─┘┘└┘ ┴   ╚═╝└─┘┴ ┴┴ ┴└─┘┴└─└─┘└─┘

  `;

  console.info(`%c${charAt}`, 'color: #5BE49B');
  useScrollToTop();
  return (
    <AuthProvider>
      <SettingsProvider
        defaultSettings={{
          themeMode: 'light', // 'light' | 'dark'
          themeDirection: 'ltr', //  'rtl' | 'ltr'
          themeContrast: 'default', // 'default' | 'bold'
          themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
          themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
          themeStretch: false,
        }}
      >
        <ThemeProvider>
          <MotionLazy>
            <SnackbarProvider>
              <SettingsDrawer />
              <ProgressBar />
              <Router />
            </SnackbarProvider>
          </MotionLazy>
        </ThemeProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
