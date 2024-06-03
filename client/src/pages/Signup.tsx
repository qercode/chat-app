/// <reference types="vite-plugin-svgr/client" />

import React, { useState, ChangeEvent, FormEvent, useContext } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SlashEyeIcon from '../assets/icons/eye-slash-svgrepo-com.svg?react'
import EyeIcon from '../assets/icons/eye-svgrepo-com.svg?react'
import { AuthContext } from '../context/AuthContext';

interface FormData {
    fullName: string;
    username: string;
    password: string;
    confirmPassword: string;
}

const SignUpPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const authContext = useContext(AuthContext)

    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validateForm = (): boolean => {
        if (!formData.fullName || !formData.username || !formData.password || !formData.confirmPassword) {
            toast.error("Необходимо заполнить все поля")
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Пароли должны совпадать")
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
            const response = await fetch('api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();

                localStorage.setItem('user', JSON.stringify(data))
                authContext?.setAuthUser(data)
                
                toast.success('Вы успешно создали учетную запись')
                navigate('/')
            } else {
                toast.error('Возникла ошибка при входе')
            }

        } catch (error) {
            toast.error('Возникла ошибка при входе')

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-xs p-8 space-y-4 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center">Регистрация</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Полное имя"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Имя юзера"
                        value={formData.username}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={handleChange}
                            className="input input-bordered w-full pr-10"
                        />
                        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={togglePasswordVisibility}>
                            {showPassword ? <SlashEyeIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Подтвердите пароль"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="input input-bordered w-full pr-10"
                        />
                        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={toggleConfirmPasswordVisibility}>
                            {showConfirmPassword ? <SlashEyeIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? 'Регистрация...' : 'Зарегестрироваться'}
                    </button>
                </form>
                <p className="text-center">
                    Уже есть аккаунт? <Link to="/" className="text-blue-500">Войти</Link>
                </p>
            </div>
        </div>
    );
}

export default SignUpPage;
