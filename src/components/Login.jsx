import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
    console.log('Login')
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://payment-link-server-v2.vercel.app/api/auth/login', {
                username,
                password,
            });
            const { token } = response.data;
            localStorage.setItem('token', token);
            onLogin();
        } catch (err) {
            alert('Login inválido');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuário" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" />
            <button type="submit">Entrar</button>
        </form>
    );
}
