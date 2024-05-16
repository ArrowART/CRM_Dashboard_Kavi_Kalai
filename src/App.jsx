import AppRouter from "./Router/Approuter";
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <div>
      <AppRouter/>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}