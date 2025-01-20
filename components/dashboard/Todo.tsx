import React, { useState, useEffect } from "react";
import {
  MoreHorizontal,
  Calendar,
  Paperclip,
  X,
  ChevronDown,
  Filter,
  PlusIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchNotesFromDB, syncNotesToDB } from "@/db/Todo";
import Image from "next/image";
import logo from "@/public/acolytelogo.svg"


// Filter Dropdown Component
const FilterDropdown = ({ filterOpen, setFilterOpen, activeFilter, setActiveFilter, filterOptions }) => {
  return (
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
                  activeFilter === option
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
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
  );
};

// Todo Item Component

const TodoItem = ({ todo, index, deleteTodo, editTodo }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm w-[314px] h-[177px] relative"
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            todo.priority === "High"
              ? "bg-[#FFE2E5] text-[#D8727D]"
              : "bg-[#FFF5E9] text-[#D58D49]"
          }`}
        >
          {todo.priority}
        </span>
        <div className="relative">
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <div className="absolute top-6 right-0 bg-white shadow-lg rounded-xl p-2 z-10">
              <button
                className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => {
                  setMenuOpen(false);
                  editTodo(index);
                }}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => {
                  setMenuOpen(false);
                  deleteTodo(index);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
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
  );
};

// Create Todo Form Component
const CreateTodoForm = ({ newTodo, setNewTodo, addTodo, setIsCreating }) => {
  return (
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
              newTodo.priority === "High"
                ? "bg-[#fff1f1] text-[#d8727d]"
                : "bg-[#fff7e8] text-[#d58d49]"
            }`}
            onClick={() =>
              setNewTodo({
                ...newTodo,
                priority: newTodo.priority === "Low" ? "High" : "Low",
              })
            }
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {newTodo.priority}
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
        value={newTodo.title}
        onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        className="w-full mb-2 p-2 border-b border-gray-100 focus:outline-none focus:border-gray-300"
      />
      <input
        type="text"
        placeholder="Enter sub heading"
        value={newTodo.description}
        onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
        className="w-full mb-4 p-2 border-b border-gray-100 focus:outline-none focus:border-gray-300"
      />

      <div className="flex items-center gap-2 mb-4">
        <Calendar size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="DD/MM/YYYY"
          value={newTodo.dueDate}
          onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
          className="text-gray-500 focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Add collaborators</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Number of collaborators"
            value={newTodo.collaborators}
            onChange={(e) =>
              setNewTodo({
                ...newTodo,
                collaborators: parseInt(e.target.value, 10) || 0,
              })
            }
            className="flex-1 p-2 text-sm focus:outline-none text-gray-600"
          />
          <div className="flex -space-x-2">
            {[...Array(newTodo.collaborators)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() =>
            setNewTodo({
              title: "",
              description: "",
              dueDate: "",
              priority: "Low",
              collaborators: 0,
              files: 0,
            })
          }
        >
          <div className="w-[107.21px] h-[27.87px] relative">
            <div className="w-[107.21px] h-[27.87px] left-0 top-0 absolute bg-gradient-to-b from-[#c7c7c7] to-[#c7c7c7] rounded-[6.97px]" />
            <div className="left-[28.15px] top-[7.51px] absolute text-center text-black text-[10.72px] font-semibold ">
              Clear List
            </div>
          </div>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addTodo}
        >
          <div className="w-[107.21px] h-[27.87px] relative">
            <div className="w-[107.21px] h-[27.87px] left-0 top-0 absolute bg-gradient-to-b from-emerald-700 to-[#38a169] rounded-[6.97px]" />
            <div className="left-[27.15px] top-[7.51px] absolute text-center text-white text-[10.72px] font-semibold">
              Add to-do
            </div>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};


const TodoList = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [priority, setPriority] = useState("Low");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    collaborators: 0,
    files: 0,
  });

  useEffect(() => {
    fetchNotesFromIndexDB();
  }, []);

  const fetchNotesFromIndexDB = async () => {
    try {
      const data = await fetchNotesFromDB();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const syncNotesToIndexDB = async (notes) => {
    try {
      await syncNotesToDB(notes);
    } catch (error) {
      console.error("Error syncing notes:", error);
    }
  };

  const addTodo = () => {
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    syncNotesToIndexDB(updatedTodos);
    resetForm();
  };

  const updateTodo = () => {
    const updatedTodos = todos.map((todo, index) =>
      index === editingIndex ? newTodo : todo
    );
    setTodos(updatedTodos);
    syncNotesToIndexDB(updatedTodos);
    resetForm();
  };

  const resetForm = () => {
    setNewTodo({
      title: "",
      description: "",
      dueDate: "",
      priority: "Low",
      collaborators: 0,
      files: 0,
    });
    setIsCreating(false);
    setIsEditing(false);
    setEditingIndex(null);
  };

  const editTodo = (index) => {
    const todoToEdit = todos[index];
    setNewTodo(todoToEdit);
    setPriority(todoToEdit.priority);
    setEditingIndex(index);
    setIsEditing(true);
    setIsCreating(true);
  };

  const deleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    syncNotesToIndexDB(updatedTodos);
  };

  const filteredTodos =
    activeFilter === "All"
      ? todos
      : todos.filter((todo) => todo.priority === activeFilter);

  const filterOptions = ["All", "High", "Low"];

  return (
    <div className="w-[356px] h-[873px]">
      <div className="max-w-full mx-auto">
        <FilterDropdown
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filterOptions={filterOptions}
        />

        <div className="bg-[#f6f7f9] rounded-2xl p-4 w-[354px] h-[685px]">
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
              <PlusIcon className="w-6 h-6 bg-[#b0a8c5] rounded-md " />
            </motion.button>
          </div>

          <AnimatePresence mode="popLayout">
            {!isCreating &&
              filteredTodos.map((todo, index) => (
                <TodoItem
                  key={index}
                  todo={todo}
                  index={index}
                  deleteTodo={deleteTodo}
                  editTodo={editTodo}
                />
              ))}

            {isCreating && (
              <CreateTodoForm
                priority={priority}
                setPriority={setPriority}
                newTodo={newTodo}
                setNewTodo={setNewTodo}
                addTodo={isEditing ? updateTodo : addTodo}
                setIsCreating={setIsCreating}
              />
            )}
          </AnimatePresence>
        </div>

        <div  className="w-[354px] h-[68px] bg-[#f6f7f9] rounded-2xl mt-10 flex items-center justify-center">
         <div className="w-[268px] h-[43px] flex items-center justify-around">
         <Image src={logo} alt="s"  className="w-[60px] h-[43px]"/>
         <p className=" text-[#553c9a] text-xl font-semibold">Acolyte Chat Bot</p>
         </div>
        </div>
      </div>
    </div>
  );
};




export default TodoList;
