import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSocketContext } from '../context/SocketContext';

interface SideBarProps {
    onUserClick: (id: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ onUserClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const context = useContext(AuthContext)
    const socketContext = useSocketContext()

    const filteredUsers = context?.users.filter(user => user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return (
        <div className="w-1/3 p-4 border-r">
            <input
                type="text"
                placeholder="Search users"
                className="input input-bordered mb-4 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
                {filteredUsers && filteredUsers.map((user, index) => (
                    <li
                        key={index}
                        className={`flex items-center p-2 hover:bg-gray-200 cursor-pointer ${context?.selectedConversation === user._id ? 'bg-gray-200' : ''}`}
                        onClick={() => onUserClick(user._id)}
                    >
                        <div className="avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                                <span>{user.fullName.charAt(0).toUpperCase()}</span>
                            </div>
                        </div>
                        <span className="ml-2">{user.fullName}</span>
                        {socketContext.onlineUsers.includes(user._id) && (
                            <span className="ml-2 text-green-500">●</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideBar;
