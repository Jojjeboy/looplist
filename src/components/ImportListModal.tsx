import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Item } from '../types';

interface ImportListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (name: string, items: Item[]) => Promise<void>;
}

interface ValidationResult {
    isValid: boolean;
    error?: string;
    listData?: {
        name: string;
        items: Item[];
    };
}

// Validation function with helpful error messages
const validateAndParseJSON = (jsonString: string): ValidationResult => {
    // Check if empty
    if (!jsonString.trim()) {
        return {
            isValid: false,
            error: 'Please paste JSON data to import.',
        };
    }

    // Try to parse JSON
    let parsed: unknown;
    try {
        parsed = JSON.parse(jsonString);
    } catch {
        return {
            isValid: false,
            error: 'Invalid JSON format. Please check for syntax errors (missing quotes, commas, brackets, etc.).',
        };
    }

    // Check if it's an object
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        return {
            isValid: false,
            error: 'JSON must be an object with "name" and "items" fields.',
        };
    }

    const data = parsed as Record<string, unknown>;

    // Check for name field
    if (!('name' in data)) {
        return {
            isValid: false,
            error: 'Missing required field "name". Your list must have a name.',
        };
    }

    if (typeof data.name !== 'string' || data.name.trim() === '') {
        return {
            isValid: false,
            error: 'The "name" field must be a non-empty string.',
        };
    }

    // Check for items field
    if (!('items' in data)) {
        return {
            isValid: false,
            error: 'Missing required field "items". Your list must have at least one item.',
        };
    }

    if (!Array.isArray(data.items)) {
        return {
            isValid: false,
            error: 'The "items" field must be an array.',
        };
    }

    if (data.items.length === 0) {
        return {
            isValid: false,
            error: 'Items array is empty. Please add at least one item.',
        };
    }

    // Validate and transform items
    const items: Item[] = [];
    for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];

        // Support simple string format
        if (typeof item === 'string') {
            items.push({
                id: crypto.randomUUID(),
                text: item,
                completed: false,
            });
        }
        // Support detailed object format
        else if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
            const itemObj = item as Record<string, unknown>;

            if (!('text' in itemObj) || typeof itemObj.text !== 'string') {
                return {
                    isValid: false,
                    error: `Invalid item format at position ${i + 1}. Items must be strings or objects with a "text" field.`,
                };
            }

            items.push({
                id: crypto.randomUUID(),
                text: itemObj.text,
                completed: typeof itemObj.completed === 'boolean' ? itemObj.completed : false,
            });
        }
        else {
            return {
                isValid: false,
                error: `Invalid item format at position ${i + 1}. Items must be strings or objects with a "text" field.`,
            };
        }
    }

    return {
        isValid: true,
        listData: {
            name: data.name,
            items,
        },
    };
};

export const ImportListModal: React.FC<ImportListModalProps> = ({ isOpen, onClose, onImport }) => {
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [showExample, setShowExample] = useState(false);

    const handleImport = async () => {
        setError('');

        const result = validateAndParseJSON(jsonInput);

        if (!result.isValid) {
            setError(result.error!);
            return;
        }

        try {
            setIsImporting(true);
            await onImport(result.listData!.name, result.listData!.items);

            // Reset and close on success
            setJsonInput('');
            setError('');
            onClose();
        } catch {
            setError('Failed to import list. Please try again.');
        } finally {
            setIsImporting(false);
        }
    };

    const handleClose = () => {
        setJsonInput('');
        setError('');
        setShowExample(false);
        onClose();
    };

    const exampleSimple = `{
  "name": "Shopping List",
  "items": ["Milk", "Bread", "Eggs", "Butter"]
}`;

    const exampleDetailed = `{
  "name": "Morning Routine",
  "items": [
    { "text": "Wake up", "completed": true },
    { "text": "Exercise", "completed": false },
    { "text": "Shower", "completed": false }
  ]
}`;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden transform transition-all">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Import List from JSON
                        </h3>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Paste JSON data below to import a list. The JSON should contain a &quot;name&quot; and &quot;items&quot; field.
                        </p>

                        {/* Example toggle */}
                        <button
                            onClick={() => setShowExample(!showExample)}
                            className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            {showExample ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            {showExample ? 'Hide examples' : 'Show example formats'}
                        </button>

                        {/* Examples */}
                        {showExample && (
                            <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                                <div>
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Simple format (recommended):
                                    </p>
                                    <pre className="text-xs bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
                                        {exampleSimple}
                                    </pre>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Detailed format (with completion status):
                                    </p>
                                    <pre className="text-xs bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
                                        {exampleDetailed}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* JSON Input */}
                        <div>
                            <textarea
                                value={jsonInput}
                                onChange={(e) => {
                                    setJsonInput(e.target.value);
                                    setError(''); // Clear error when user types
                                }}
                                placeholder='Paste JSON here, e.g. {"name": "My List", "items": ["Item 1", "Item 2"]}'
                                className="w-full h-40 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex gap-2">
                                <span className="text-red-600 dark:text-red-400 text-sm">⚠️</span>
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleImport}
                            disabled={isImporting}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isImporting ? 'Importing...' : 'Import'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

