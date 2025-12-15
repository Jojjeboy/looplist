import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { List } from '../types';

interface SessionPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateSession: (name: string, listIds: string[]) => void;
    lists: List[];
}

export const SessionPicker: React.FC<SessionPickerProps> = ({
    isOpen,
    onClose,
    onCreateSession,
    lists,
}) => {
    const { t } = useTranslation();
    const [sessionName, setSessionName] = useState('');
    const [selectedListIds, setSelectedListIds] = useState<string[]>([]);

    if (!isOpen) return null;

    const toggleList = (listId: string) => {
        setSelectedListIds(prev =>
            prev.includes(listId)
                ? prev.filter(id => id !== listId)
                : [...prev, listId]
        );
    };

    const handleCreate = () => {
        if (sessionName.trim() && selectedListIds.length > 0) {
            onCreateSession(sessionName.trim(), selectedListIds);
            // Reset state
            setSessionName('');
            setSelectedListIds([]);
            onClose();
        }
    };

    const handleCancel = () => {
        // Reset state
        setSessionName('');
        setSelectedListIds([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden transform transition-all">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {t('sessions.createTitle', 'Skapa Session')}
                        </h3>
                        <button
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('sessions.sessionName', 'Sessionsnamn')}
                        </label>
                        <input
                            type="text"
                            value={sessionName}
                            onChange={(e) => setSessionName(e.target.value)}
                            placeholder={t('sessions.namePlaceholder', 'T.ex. Tisdagens morgon')}
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            autoFocus
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('sessions.selectLists', 'Välj listor')} ({selectedListIds.length})
                        </label>
                        <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-xl p-2">
                            {lists.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">
                                    {t('sessions.noLists', 'Inga listor tillgängliga')}
                                </p>
                            ) : (
                                lists.map((list) => {
                                    const isSelected = selectedListIds.includes(list.id);
                                    return (
                                        <button
                                            key={list.id}
                                            onClick={() => toggleList(list.id)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                                                isSelected
                                                    ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500'
                                                    : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {list.name}
                                            </span>
                                            {isSelected && (
                                                <Check size={18} className="text-blue-600 dark:text-blue-400" />
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {t('common.cancel', 'Avbryt')}
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={!sessionName.trim() || selectedListIds.length === 0}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-colors ${
                                !sessionName.trim() || selectedListIds.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {t('sessions.create', 'Skapa Session')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
