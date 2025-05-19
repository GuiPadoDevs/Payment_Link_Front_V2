import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import PaymentForm from './components/PaymentForm';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/admin" />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/pagamento/:id" element={
                    <div style={{ textAlign: 'center', overflow: hidden}}>
                        <PaymentForm />
                    </div>
                } />
            </Routes>
        </Router>
    );
}
