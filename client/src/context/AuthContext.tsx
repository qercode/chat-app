import { createContext, useState, ReactNode, FC, useEffect } from 'react';
import { IMessage } from '../types/IMessage';
import { IUser } from '../types/IUser';

interface AuthUser {
    _id: string;
    name: string;
}



export interface AuthContextProps {
    authUser: AuthUser | null,
    setAuthUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
    selectedConversation: string,
    messages: IMessage[],
    setSelectedConversation: React.Dispatch<React.SetStateAction<string>>,
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>,
    users: IUser[],
    setUsers: React.Dispatch<React.SetStateAction<IUser[]>>
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider: FC<AuthContextProviderProps> = ({ children }) => {
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);
    const [selectedConversation, setSelectedConversation] = useState<string>("")
    const [messages, setMessages] = useState<IMessage[]>([])
    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setAuthUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user from localStorage', error);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            authUser,
            setAuthUser,
            messages,
            setMessages,
            selectedConversation,
            setSelectedConversation,
            users,
            setUsers
        }}>
            {children}
        </AuthContext.Provider>
    );
};
