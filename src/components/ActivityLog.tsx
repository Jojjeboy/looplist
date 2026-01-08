import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GitCommit, Calendar, User, ChevronDown, FileText, ExternalLink } from 'lucide-react';
import commitsData from '../commits.json';

import { Commit } from '../types';

const commits = commitsData as Commit[];

const GITHUB_REPO = 'https://github.com/Jojjeboy/anti';

export const ActivityLog: React.FC = () => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(20);
    const [expandedCommits, setExpandedCommits] = useState<Set<string>>(new Set());

    const totalPages = Math.ceil(commits.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedCommits = commits.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleCommit = (hash: string) => {
        const newExpanded = new Set(expandedCommits);
        if (newExpanded.has(hash)) {
            newExpanded.delete(hash);
        } else {
            newExpanded.add(hash);
        }
        setExpandedCommits(newExpanded);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                        <GitCommit size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('activity.title', 'Activity Log')}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{t('activity.subtitle', 'Recent updates and changes')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-2 py-1 text-xs rounded-md border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            {t('common.prev', 'Prev')}
                        </button>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-2 py-1 text-xs rounded-md border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            {t('common.next', 'Next')}
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t('activity.show', 'Show')}:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>

            </div>

            <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-8 pb-8">
                {displayedCommits.map((commit, index) => {
                    const isExpanded = expandedCommits.has(commit.hash);
                    const fileCount = commit.files?.length || 0;

                    return (
                        <div key={commit.hash} className="ml-6 relative">
                            <span className="absolute -left-[31px] top-1 flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-900 rounded-full ring-4 ring-white dark:ring-gray-900">
                                <span className={`w-3 h-3 rounded-full ${index === 0 && currentPage === 1 ? 'bg-blue-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                            </span>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all overflow-hidden">
                                <div className="p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {commit.message}
                                        </h3>
                                        <a
                                            href={`${GITHUB_REPO}/commit/${commit.hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 w-fit"
                                        >
                                            {commit.hash.substring(0, 7)}
                                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <User size={14} />
                                            <span>{commit.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            <time dateTime={commit.date}>
                                                {new Date(commit.date).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </time>
                                        </div>
                                    </div>

                                    {fileCount > 0 && (
                                        <button
                                            onClick={() => toggleCommit(commit.hash)}
                                            className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            <FileText size={14} />
                                            <span>{t('activity.filesChanged', { count: fileCount })}</span>
                                            <ChevronDown
                                                size={14}
                                                className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                    )}
                                </div>

                                {isExpanded && fileCount > 0 && (
                                    <div className="px-5 pb-5">
                                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                            <div className="space-y-1">
                                                {commit.files!.map((file, fileIndex) => (
                                                    <div
                                                        key={fileIndex}
                                                        className="flex items-center gap-2 text-sm font-mono"
                                                    >
                                                        <span className={`
                                                            px-1.5 py-0.5 rounded text-xs font-medium
                                                            ${file.status === 'M' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : ''}
                                                            ${file.status === 'A' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : ''}
                                                            ${file.status === 'D' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : ''}
                                                        `}>
                                                            {file.status}
                                                        </span>
                                                        <span className="text-gray-700 dark:text-gray-300 truncate">
                                                            {file.path}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>


        </div>
    );
};
