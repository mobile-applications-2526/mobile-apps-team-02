import "./global.css";
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoadingScreen from './components/LoadingScreen';
import AppNavigator from './navigation/AppNavigator';
import { authService } from './services/auth.service';

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [initialRoute, setInitialRoute] = React.useState('Start');

  React.useEffect(() => {
    // Check for existing session on app startup
    const initializeApp = async () => {
      try {
        const session = await authService.checkSession();
        setInitialRoute(session ? 'Home' : 'Start');
      } catch (error) {
        console.error('Error checking session:', error);
        setInitialRoute('Start');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    // Listen for auth state changes
    const subscription = authService.setupAuthListener((_event, session) => {
      if (_event === 'SIGNED_OUT') {
        setInitialRoute('Start');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <AppNavigator initialRoute={initialRoute} />
    </NavigationContainer>
  );
}

