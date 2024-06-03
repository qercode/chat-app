import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { formatReadableDate } from '../helpers';
import { useSocketContext } from '../context/SocketContext';

interface MessageContainerProps {
    handleSendMessage: () => void;
    handleInputKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    newMessage: string;
    setNewMessage: React.Dispatch<React.SetStateAction<string>>;
    loading: boolean;
}

const MessageContainer: React.FC<MessageContainerProps> = ({
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleInputKeyPress,
    loading
}) => {
    const context = useContext(AuthContext);
    const socketContext = useSocketContext();
    const messagesEndRef = useRef<HTMLDivElement>(null);


    console.log(socketContext);
    

    const getSelectedUserName = (id: string) => {
        return context?.users.find(user => user._id === id)?.fullName || "Unknown User";
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [context?.messages]);

    return (
        <div className="w-2/3 p-4">
            <h2 className="text-xl font-bold mb-4">Чат</h2>
            {!context?.selectedConversation ? (
                <div className="h-72 flex items-center justify-center border rounded">
                    <p className="text-gray-500">Выберете с кем начать общение</p>
                </div>
            ) : (
                <>
                    <div className="h-72 overflow-y-auto p-4 border rounded">
                        {loading ? (
                            <>
                                <div className="skeleton h-20 mb-4"></div>
                                <div className="skeleton h-20 mb-4"></div>
                                <div className="skeleton h-20 mb-4"></div>
                            </>
                        ) : (
                            context?.messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-4 ${msg.senderId === context.authUser?._id ? 'text-right' : 'text-left'}`}
                                >
                                    <p className="font-semibold">
                                        {msg.senderId === context.authUser?._id ? 'Я' : getSelectedUserName(msg.senderId)}
                                    </p>
                                    <div className={`inline-block p-2 rounded ${msg.senderId === context.authUser?._id ? 'bg-blue-200' : 'bg-gray-200'}`}>
                                        <p>{msg.message}</p>
                                        <p className="text-xs text-gray-500">{formatReadableDate(msg.createdAt)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="mt-4 flex">
                        <input
                            type="text"
                            placeholder="Введите сообщение"
                            className="input input-bordered flex-grow"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleInputKeyPress}
                        />
                        <button className="btn btn-primary ml-2" onClick={handleSendMessage}>Отправить</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default MessageContainer;
