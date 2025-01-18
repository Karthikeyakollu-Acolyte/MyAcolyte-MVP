import React, { useState } from 'react';
import { MoreHorizontal, Calendar, Paperclip, X, ChevronDown, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TodoList = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [priority, setPriority] = useState('Low');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const todos = [
    {
      priority: 'Low',
      title: 'Brainstorming',
      description: 'Brainstorming brings team members\' diverse experience into play.',
      dueDate: '01/08/2025',
      files: 0,
      collaborators: 3
    },
    {
      priority: 'High',
      title: 'Research',
      description: 'User research helps you to create an optimal product for users.',
      dueDate: '01/08/2025',
      files: 3,
      collaborators: 2
    },
    {
      priority: 'High',
      title: 'Wireframes',
      description: 'Low fidelity wireframes include the most basic content and visuals.',
      dueDate: '01/08/2025',
      files: 0,
      collaborators: 3
    }
  ];

  const filteredTodos = activeFilter === 'All' 
    ? todos 
    : todos.filter(todo => todo.priority === activeFilter);

  const filterOptions = ['All', 'High', 'Low'];

  return (
    <div className="w-[356px] h-[873px]">
      <div className="max-w-2xl mx-auto">
        {/* Filter Dropdown */}
        <div className="relative mb-4">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm"
            onClick={() => setFilterOpen(!filterOpen)}
            whileTap={{ scale: 0.98 }}
          >
            <Filter size={16} className="text-gray-600" />
            <span className="text-gray-600">Filter</span>
            <motion.div
              animate={{ rotate: filterOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-gray-600" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-12 left-0 bg-white rounded-xl shadow-lg p-2 z-10 min-w-[120px]"
              >
                {filterOptions.map((option) => (
                  <motion.button
                    key={option}
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      activeFilter === option ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setActiveFilter(option);
                      setFilterOpen(false);
                    }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Todo Section */}
        <div className="bg-[#e5eaf4] rounded-2xl p-4 w-[354px] h-[685px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <span className="font-semibold text-gray-800">To Do</span>
              <span className="bg-[#E4EBFA] text-[#625F87] px-2 py-0.5 rounded-full text-sm">
                {filteredTodos.length}
              </span>
            </div>
            <motion.button 
              onClick={() => setIsCreating(true)}
              className="w-6 h-6 bg-[#e8e8fd] rounded-full flex items-center justify-center text-[#5030E5] hover:bg-[#E4EBFA]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span>+</span>
            </motion.button>
          </div>

          {/* Todo Items */}
          <AnimatePresence mode="popLayout">
            {!isCreating && filteredTodos.map((todo, index) => (
              <motion.div
                key={todo.title}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl p-4 mb-3 shadow-sm w-[314px] h-[177px]"
              >
                <div className="flex justify-between items-start mb-2 ">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    todo.priority === 'High' 
                      ? 'bg-[#FFE2E5] text-[#D8727D]' 
                      : 'bg-[#FFF5E9] text-[#D58D49]'
                  }`}>
                    {todo.priority}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-1">{todo.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{todo.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[...Array(todo.collaborators)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>Due: {todo.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Paperclip size={16} />
                      <span>{todo.files} files</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Create New Todo Form */}
            <AnimatePresence>
              {isCreating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <motion.button 
                        className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                          priority === 'High' 
                            ? 'bg-[#fff1f1] text-[#d8727d]' 
                            : 'bg-[#fff7e8] text-[#d58d49]'
                        }`}
                        onClick={() => setPriority(priority === 'Low' ? 'High' : 'Low')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {priority}
                        <ChevronDown size={14} />
                      </motion.button>
                    </div>
                    <motion.button 
                      onClick={() => setIsCreating(false)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={16} className="text-gray-400 hover:text-gray-600" />
                    </motion.button>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Enter heading"
                    className="w-full mb-2 p-2 border-b border-gray-100 focus:outline-none focus:border-gray-300"
                  />
                  <input
                    type="text"
                    placeholder="Enter sub heading"
                    className="w-full mb-4 p-2 border-b border-gray-100 focus:outline-none focus:border-gray-300"
                  />
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={16} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      className="text-gray-500 focus:outline-none"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">Add collaborators</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Enter mail eg. abc@gmail.com"
                        className="flex-1 p-2 text-sm focus:outline-none text-gray-600"
                      />
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <motion.button 
                      className="px-4 py-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Clear List
                    </motion.button>
                    <motion.button 
                      className="px-4 py-2 bg-[#5030E5] text-white rounded-xl hover:bg-[#452ACC]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add to-do
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TodoList;