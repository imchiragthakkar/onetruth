import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { GuruSahayak } from '../lib/guruSahayak';
import { useAuthStore } from '../store/useAuthStore';

// Since we are client-side only for this demo, and avoiding .env requirement for the user first run if possible,
// we will ask for the key in the UI if not present.
// In a real production app, this would be in .env
const ENV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const GuruChat = ({ isOpen, onClose }) => {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [apiKey, setApiKey] = useState(ENV_API_KEY || localStorage.getItem('gemini_api_key') || '');
    const [showKeyInput, setShowKeyInput] = useState(!ENV_API_KEY && !localStorage.getItem('gemini_api_key'));

    // Initialize Agent ref
    const agentRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (apiKey && !agentRef.current) {
            // Determine age group from user data or default to 'adults'
            // Assuming user might have an ageGroup field, otherwise default.
            const ageGroup = user?.ageGroup || 'adults';
            agentRef.current = new GuruSahayak(apiKey, ageGroup);

            // Initial greeting
            setMessages([{
                id: 'init',
                role: 'assistant',
                text: `Namaste ${user?.displayName || 'Seeker'}. I am here to listen. What is troubling your mind today?`
            }]);
        }
    }, [apiKey, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSaveKey = (key) => {
        if (key.trim().length > 0) {
            setApiKey(key);
            localStorage.setItem('gemini_api_key', key);
            setShowKeyInput(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !agentRef.current) return;

        const userMsgText = inputValue;
        setInputValue('');

        // Add User Message
        const userMsg = { id: Date.now(), role: 'user', text: userMsgText };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        try {
            // Get Agent Response
            const response = await agentRef.current.processMessage(userMsgText);

            const agentMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                text: response.text,
                isCrisis: response.isCrisis
            };

            setMessages(prev => [...prev, agentMsg]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'assistant',
                text: "I apologize, I am having trouble connecting to the source. Please check your connection or API key.",
                isError: true
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 rounded-full text-primary-600">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="font-serif font-bold text-gray-800">Guru Sahayak</h3>
                            <p className="text-xs text-gray-500">Root Cause Engine</p>
                        </div>
                    </div>
                    <Button variant="ghost" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} className="text-gray-500" />
                    </Button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">

                    {showKeyInput ? (
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 text-center space-y-4">
                            <AlertCircle className="mx-auto text-primary-500" size={32} />
                            <h4 className="font-serif font-bold text-gray-800">Setup Required</h4>
                            <p className="text-sm text-gray-600">To consult the Guru, please provide your Google Gemini API Key.</p>
                            <input
                                type="password"
                                placeholder="Paste API Key here..."
                                className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-primary-400 outline-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveKey(e.target.value);
                                }}
                                onBlur={(e) => handleSaveKey(e.target.value)}
                            />
                            <p className="text-xs text-gray-400">Key is stored locally in your browser.</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`
                                        max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                                        ${msg.role === 'user'
                                            ? 'bg-primary-600 text-white rounded-tr-none'
                                            : msg.isCrisis
                                                ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-none'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                        }
                                    `}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))
                    )}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <div className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={showKeyInput ? "Enter API Key above..." : "Type your thought..."}
                            disabled={showKeyInput}
                            className="flex-1 p-3 pr-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-100 outline-none text-gray-700 placeholder-gray-400"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || showKeyInput}
                            className="absolute right-2 p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-gray-300 mt-2">
                        Guru Sahayak can make mistakes. Consider checking important info.
                    </p>
                </div>
            </div>
        </div>
    );
};
