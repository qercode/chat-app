import React, { useState, ChangeEvent, FormEvent, useContext } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface LoginFormData {
    username: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const authContext = useContext(AuthContext)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = (): boolean => {
        if (!formData.username || !formData.password) {
            toast.error('Необходимо заполнить все поля')
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        try {
            const response = await fetch('api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {

                const data = await response.json()

                localStorage.setItem('user', JSON.stringify(data))
                authContext?.setAuthUser(data)
                
                toast.success('Вы успешно вошли в Вашу учетную запись')
                navigate('/')
            } else {
                toast.error('Вознилка ошибка при входе в учетную запись')

            }
        } catch (error) {
            toast.error('Не удалось войти, попробуйте еще раз')
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-xs p-8 space-y-4 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center">Войти</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Имя юзера"
                        value={formData.username}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? 'Загрузка...' : 'Войти'}
                    </button>
                </form>
                <p className="text-center">
                    Еще нет учетной записи? <Link to="/signup" className="text-blue-500">Создать учетную запись</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
