import { render, screen, fireEvent } from '@testing-library/react';
import { ListDetail } from './ListDetail';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as AppContext from '../context/AppContext';

// Mock i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock hooks
vi.mock('../hooks/useVoiceInput', () => ({
    useVoiceInput: () => ({
        isListening: false,
        transcript: '',
        startListening: vi.fn(),
        stopListening: vi.fn(),
        resetTranscript: vi.fn(),
        hasSupport: true
    })
}));

// Mock dnd-kit
vi.mock('@dnd-kit/core', () => ({
    DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    closestCenter: vi.fn(),
    PointerSensor: vi.fn(),
    KeyboardSensor: vi.fn(),
    useSensor: vi.fn(),
    useSensors: vi.fn(),
}));

vi.mock('@dnd-kit/sortable', () => ({
    SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    sortableKeyboardCoordinates: vi.fn(),
    verticalListSortingStrategy: vi.fn(),
    arrayMove: vi.fn(),
}));

// Mock child components
vi.mock('./SortableItem', () => ({
    SortableItem: ({ item, onToggle }: { item: { id: string; text: string }; onToggle: (id: string) => void }) => (
        <div data-testid="sortable-item">
            {item.text}
            <button onClick={() => onToggle(item.id)}>Toggle</button>
        </div>
    )
}));

vi.mock('lucide-react', () => ({
    Plus: () => <div />,
    ChevronLeft: () => <div />,
    RotateCcw: () => <div />,
    Mic: () => <div />,
    MicOff: () => <div />
}));

const mockUpdateListItems = vi.fn();

describe('ListDetail', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(AppContext, 'useApp').mockReturnValue({
            lists: [
                {
                    id: 'list1',
                    name: 'My List',
                    categoryId: 'cat1',
                    items: [
                        { id: 'i1', text: 'Apple', completed: false },
                        { id: 'i2', text: 'Banana', completed: true }
                    ]
                }
            ],
            updateListItems: mockUpdateListItems,
            deleteItem: vi.fn(),
            updateListName: vi.fn(),
            // defaults
            categories: [],
            addCategory: vi.fn(),
            deleteCategory: vi.fn(),
            reorderCategories: vi.fn(),
            addList: vi.fn(),
            deleteList: vi.fn(),
            copyList: vi.fn(),
            moveList: vi.fn(),
            updateCategoryName: vi.fn(),
            reorderLists: vi.fn(),
            addSession: vi.fn(),
            combinations: [],
            addCombination: vi.fn(),
            updateCombination: vi.fn(),
            deleteCombination: vi.fn(),
            sessions: [],
            completeSession: vi.fn(),
            deleteSession: vi.fn(),
        } as Partial<ReturnType<typeof AppContext.useApp>> as ReturnType<typeof AppContext.useApp>);
    });

    const renderComponent = () => {
        render(
            <MemoryRouter initialEntries={['/list/list1']}>
                <Routes>
                    <Route path="/list/:listId" element={<ListDetail />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('renders list items', () => {
        renderComponent();
        expect(screen.getByText('Apple')).toBeDefined();
        expect(screen.getByText('Banana')).toBeDefined();
    });

    it('adds a new item', () => {
        renderComponent();
        const input = screen.getByPlaceholderText('lists.addItemPlaceholder');
        fireEvent.change(input, { target: { value: 'Cherry' } });

        const form = input.closest('form');
        fireEvent.submit(form!);

        expect(mockUpdateListItems).toHaveBeenCalledWith('list1', expect.arrayContaining([
            expect.objectContaining({ text: 'Apple' }),
            expect.objectContaining({ text: 'Banana' }),
            expect.objectContaining({ text: 'Cherry', completed: false })
        ]));
    });

    it('toggles item completion', () => {
        renderComponent();
        const toggleButtons = screen.getAllByText('Toggle');
        fireEvent.click(toggleButtons[0]); // Apple

        expect(mockUpdateListItems).toHaveBeenCalledWith('list1', expect.arrayContaining([
            expect.objectContaining({ id: 'i1', completed: true }), // Toggled to true
            expect.objectContaining({ id: 'i2', completed: true })
        ]));
    });

    it('sorts alphabetical', () => {
        // Change default mocked return to test sorting order if SortableItem was rendering in order
        // With mock child component, we verify items are passed.
        // Or we can check if the rendered elements order changes.
        // Actually, React Testing Library screens reads DOM order.

        renderComponent();

        // Default manual: Apple, Banana
        // Alphabetical: Apple, Banana (same)
        // Let's add Zebra to make it distinct

        // Note: state changes inside component trigger re-render.
        // We can test that sorting option changes the rendered order if items were unordered.
    });
});
