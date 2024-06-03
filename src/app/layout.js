// In your main app entry point or wherever you set up your app's layout
import ServerLayout from './ServerLayout';

export default function App({ children }) {
  return (
    <ServerLayout>
      {children}
    </ServerLayout>
  );
}
