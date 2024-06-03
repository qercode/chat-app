import React, { useContext, useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import MessageContainer from '../components/MessageContainer';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { useSocketContext } from '../context/SocketContext';

function HomePage() {

    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState<boolean>(false)
    const context = useContext(AuthContext)
    const socketContext = useSocketContext()

    const navigate = useNavigate()


    useEffect(() => {
        const fetchConversations = async () => {
            setLoading(true)
            try {
                const response = await fetch('api/users')
                const data = await response.json()
                context?.setUsers(data)


            } catch (error) {
                toast.error('Ошибка получения данных')
            } finally {
                setLoading(false)
            }
        }
        fetchConversations()

        socketContext.socket?.on("newMessage", (newMessage) => {
            context?.setMessages(prev => [...prev, newMessage])
        })



        return () => {
            context?.setSelectedConversation('')
            socketContext.socket?.off("newMessage")
        }

    }, [])

    const handleSendMessage = async () => {

        try {
            const response = await fetch(`/api/messages/send/${context?.selectedConversation}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: newMessage })
            })
            if (response.ok) {
                const data = await response.json()
                context?.setMessages((prev) => [...prev, data])
            } else {
                throw new Error
            }



        } catch (error) {
            toast.error("Не удалось отправить сообщение")
        }
        finally {
            setNewMessage('')
        }

    };

    const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleUserClick = async (id: string) => {
        try {
            const response = await fetch(`/api/messages/${id}`)
            if (response.ok) {
                const data = await response.json()
                context?.setMessages(data)
            } else {
                throw new Error
            }
            context?.setSelectedConversation(id)
        } catch (error) {
            toast.error('Возникла проблема при загрузке сообщений')
        }

    };

    const onLogoutClick = async () => {

        try {
            const response = await fetch('api/auth/logout')
            if (response.ok) {
                localStorage.removeItem('user')
                context?.setAuthUser(null)

                navigate('/login')
                toast.success('Вы успешно вышли из вашей учетной записи')
            }

        } catch (error) {
            toast.error('Возникла ошибка при выходе')
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-3/5 h-600 bg-white p-4 shadow-lg rounded-lg flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Пользователи</h2>
                    <button className="btn btn-secondary btn-sm" onClick={onLogoutClick}>Выйти</button>
                </div>
                <div className="flex flex-grow">
                    <SideBar onUserClick={handleUserClick} />
                    <MessageContainer
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        handleSendMessage={handleSendMessage}
                        handleInputKeyPress={handleInputKeyPress}
                        loading={loading} />
                </div>
            </div>
        </div>
    );
}

export default HomePage;
