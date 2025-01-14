import React, { useState, useEffect, useRef, memo } from 'react';
import { MoreHorizontal, MessageSquare, File, Plus, Filter, Calendar, X, Edit2, Trash2 } from 'lucide-react';
import { fetchNotesFromDB, syncNotesToDB } from '@/db/Todo';

// Memoized input components to prevent focus loss
const NoteFormInput = memo(({ value, onChange, inputRef, ...props }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <input
      {...props}
      ref={inputRef}
      value={localValue}
      onChange={handleChange}
    />
  );
});

const NoteFormTextArea = memo(({ value, onChange, inputRef, ...props }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <textarea
      {...props}
      ref={inputRef}
      value={localValue}
      onChange={handleChange}
    />
  );
});

const TodoNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

  const [filters, setFilters] = useState({
    priority: 'All',
    status: 'All',
    dateRange: 'All'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    status: 'Todo'
  });

  // Fetch initial notes from database
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setIsLoading(true);
        const dbNotes = await fetchNotesFromDB();
        setNotes(dbNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Sync notes to database whenever they change
  useEffect(() => {
    if (!isLoading) {
      const syncNotes = async () => {
        try {
          await syncNotesToDB(notes);
        } catch (error) {
          console.error('Error syncing notes:', error);
        }
      };

      syncNotes();
    }
  }, [notes, isLoading]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'Low',
      status: 'Todo'
    });
    setEditingNote(null);
    setShowAddForm(false);
  };

  const handleFormChange = (field, value) => {
    requestAnimationFrame(() => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    });
  };

  const handleSubmit = async () => {
    if (formData.title && formData.description) {
      try {
        if (editingNote) {
          setNotes(notes.map(note => 
            note.id === editingNote.id 
              ? { ...note, ...formData }
              : note
          ));
        } else {
          const newNote = {
            id: notes.length + 1,
            ...formData,
            comments: 0,
            files: 0,
            members: 1,
            createdAt: new Date()
          };
          setNotes([...notes, newNote]);
        }
        resetForm();
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }
  };

  const handleEdit = (note) => {
    setFormData({
      title: note.title,
      description: note.description,
      priority: note.priority,
      status: note.status
    });
    setEditingNote(note);
    setShowAddForm(true);
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 0);
  };

  const handleDelete = async (noteId) => {
    try {
      setNotes(notes.filter(note => note.id !== noteId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter' && field === 'title') {
      e.preventDefault();
      descriptionInputRef.current?.focus();
    }
  };

  const filteredNotes = notes.filter(note => {
    const priorityMatch = filters.priority === 'All' || note.priority === filters.priority;
    const statusMatch = filters.status === 'All' || note.status === filters.status;
    let dateMatch = true;
    
    if (filters.dateRange === 'Today') {
      dateMatch = new Date(note.createdAt).toDateString() === new Date().toDateString();
    }
    
    return priorityMatch && statusMatch && dateMatch;
  });

  const FilterPanel = () => (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Filters</h3>
        <button onClick={() => setShowFilters(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Priority</label>
          <select 
            className="w-full p-2 border rounded"
            value={filters.priority}
            onChange={(e) => setFilters({...filters, priority: e.target.value})}
          >
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Status</label>
          <select 
            className="w-full p-2 border rounded"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="All">All</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Date</label>
          <select 
            className="w-full p-2 border rounded"
            value={filters.dateRange}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
          >
            <option value="All">All Time</option>
            <option value="Today">Today</option>
          </select>
        </div>
      </div>
    </div>
  );

  const NoteForm = () => (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">{editingNote ? 'Edit Note' : 'Add New Note'}</h3>
        <button onClick={resetForm}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <select 
          className="w-full p-2 border rounded"
          value={formData.priority}
          onChange={(e) => handleFormChange('priority', e.target.value)}
        >
          <option value="Low">Low Priority</option>
          <option value="High">High Priority</option>
        </select>

        <select 
          className="w-full p-2 border rounded"
          value={formData.status}
          onChange={(e) => handleFormChange('status', e.target.value)}
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <NoteFormInput
          ref={titleInputRef}
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={formData.title}
          onChange={(value) => handleFormChange('title', value)}
          onKeyDown={(e) => handleKeyDown(e, 'title')}
        />

        <NoteFormTextArea
          ref={descriptionInputRef}
          placeholder="Description"
          className="w-full p-2 border rounded h-24"
          value={formData.description}
          onChange={(value) => handleFormChange('description', value)}
        />

        <div className="flex justify-end space-x-2">
          <button 
            onClick={resetForm}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            {editingNote ? 'Update Note' : 'Add Note'}
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 min-h-screen w-[20%]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border rounded-lg flex items-center space-x-2 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="px-4 py-2 border rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            <span>Today</span>
          </button>
        </div>
        <button 
          onClick={() => {
            setShowAddForm(true);
            setTimeout(() => {
              titleInputRef.current?.focus();
            }, 0);
          }}
          className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200"
        >
          <Plus className="w-5 h-5 text-purple-600" />
        </button>
      </div>

      {showFilters && <FilterPanel />}
      {showAddForm && <NoteForm />}

      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded ${
                  note.priority === 'Low' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                }`}>
                  {note.priority}
                </span>
                <span className="px-2 py-1 rounded bg-purple-100 text-purple-600">
                  {note.status}
                </span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEdit(note)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(note.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
            <p className="text-gray-600 mb-4">{note.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {[...Array(note.members)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
                  />
                ))}
              </div>
              
              <div className="flex items-center space-x-4 text-gray-500">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{note.comments} comments</span>
                </div>
                <div className="flex items-center space-x-1">
                  <File className="w-4 h-4" />
                  <span>{note.files} files</span>
                </div>
              </div>
            </div>

            {showDeleteConfirm === note.id && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg max-w-sm w-full m-4">
                  <h3 className="text-lg font-semibold mb-4">Delete Note</h3>
                  <p className="mb-4">Are you sure you want to delete this note?</p>
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleDelete(note.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

}

export default TodoNotes