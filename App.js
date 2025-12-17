import { Provider } from "react-redux";
import store from "./src/redux/store"; 
import AppNavigator from "./src/navigation/AppNavigator";
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <AppNavigator />
                <Toast />
            </SafeAreaProvider>
        </Provider>
    );
}

