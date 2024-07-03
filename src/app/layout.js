// layout.js
import ServerLayout from './serverLayout';

export default function App({ children }) {
  return (
    <ServerLayout>
      {children}
    </ServerLayout>
  );
}
