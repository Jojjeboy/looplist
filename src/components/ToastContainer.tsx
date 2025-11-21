import React from 'react';
import { useToast } from '../context/ToastContext';
import { X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg text-white transform transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in
                        ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-gray-800'}
                    `}
                >
                    <div className="flex items-center gap-3">
                        <p className="text-sm font-medium">{toast.message}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {toast.action && (
                            <button
                                onClick={() => {
                                    toast.action!.onClick();
                                    removeToast(toast.id);
                                }}
                                className="text-sm font-bold hover:underline"
                            >
                                {toast.action.label}
                            </button>
                        )}
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
