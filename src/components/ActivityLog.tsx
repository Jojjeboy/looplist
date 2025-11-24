import React from 'react';
import { useTranslation } from 'react-i18next';
import { GitCommit, Calendar, User } from 'lucide-react';
import commitsData from '../commits.json';
import { Commit } from '../types';

const commits = commitsData as Commit[];

export const ActivityLog: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                    <GitCommit size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('activity.title', 'Activity Log')}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{t('activity.subtitle', 'Recent updates and changes')}</p>
                </div>
            </div>

            <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-8 pb-8">
                {commits.map((commit, index) => (
                    <div key={commit.hash} className="ml-6 relative">
                        <span className="absolute -left-[31px] top-1 flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-900 rounded-full ring-4 ring-white dark:ring-gray-900">
                            <span className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                        </span>

                        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {commit.message}
                                </h3>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono">
                                    {commit.hash.substring(0, 7)}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    <time dateTime={commit.date}>
                                        {new Date(commit.date).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </time>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <User size={14} />
                                    <span>{commit.author}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
