import * as React from 'react';
import ErrorFallbackComponent from './src/utils/error-fallback.component';
import ErrorBoundary from 'react-native-error-boundary';
import { PaperProvider } from 'react-native-paper';
import { customTheme } from './src/theme/theme';
import AppNavigator from './src/navigation/app.navigator';




const App = () => {

  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
      <PaperProvider theme={customTheme}>
        <AppNavigator/>
      </PaperProvider>
    </ErrorBoundary>
  );
};
export default App;


