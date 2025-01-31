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
import logo from "@/public/acolytelogo.svg";

// Filter Dropdown Component
const FilterDropdown = ({
  filterOpen,
  setFilterOpen,
  activeFilter,
  setActiveFilter,
  filterOptions,
}) => {
  return (
    <div className="relative w-[210px] h-[41px] mb-10">
      <motion.button
        className="flex w-full h-full items-center border-2 justify-around gap-2 px-4 py-2 bg-white rounded-lg shadow-md"
        onClick={() => setFilterOpen(!filterOpen)}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-600" />
          <span className="text-gray-600 text-md">Filter</span>
        </div>
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
            className="absolute top-12 left-0 bg-white rounded-xl shadow-lg p-2 z-10 min-w-[120px] "
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
      className="bg-white rounded-2xl p-4 pl-5 mb-3 shadow-sm w-[235px] h-[150px] relative"
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
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

      <h3 className="font-semibold text-gray-800 text-md mb-1">{todo.title}</h3>
      <p className="text-gray-500 text-xs mb-4">{todo.description}</p>

      <div className="flex items-center gap-2 justify-between">
        <div className="flex -space-x-2">
          {[...Array(todo.collaborators)].map((_, i) => (
            <img
              key={i}
              className="w-4 h-4 rounded-full bg-gray-200 border-2 border-white" src={"https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80"} alt={""}            />
          ))}
        </div>
        <div className="flex items-center gap-3 text-gray-500 text-[10px]">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span className="">Due: {todo.dueDate}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Paperclip size={14} />
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
        onChange={(e) =>
          setNewTodo({ ...newTodo, description: e.target.value })
        }
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
        <div className="flex bg-black gap-2">
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

      <div className="flex justify-between w-[205px]">
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
          <div className="w-[92.21px] h-[27.87px] relative">
            <div className="w-full h-[27.87px] left-0 top-0 absolute bg-gradient-to-b from-[#c7c7c7] to-[#c7c7c7] rounded-[6.97px]" />
            <div className="left-[20.15px] top-[7.51px] absolute text-center text-black text-[10.72px] font-semibold ">
              Clear List
            </div>
          </div>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addTodo}
        >
          <div className="w-[92.21px] h-[27.87px] relative">
            <div className="w-full h-[27.87px] left-0 top-0 absolute bg-gradient-to-b from-emerald-700 to-[#38a169] rounded-[6.97px]" />
            <div className="left-[20.15px] top-[7.51px] absolute text-center text-white text-[10.72px] font-semibold">
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
    <div className="flex flex-col gap-10 w-[285px]">
      <div className="flex justify-end pr-5">
      <div className="flex w-[150px] h-[24px]">
          <FilterDropdown
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filterOptions={filterOptions}
          />
      </div>
      </div>
    
    <div className="w-[285px] h-[550px]">

      <div className="max-w-full mx-auto">
        <div className="bg-[#f6f7f9] rounded-xl p-4 w-[270px] h-[600px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <span className="font-semibold text-gray-800">To Do</span>
              <span className="bg-[#D8C7E7] text-[#553C9A] px-1.5 py-0.5 rounded-full text-xs w-[20px] h-[20px]">
                {filteredTodos.length}
              </span>
              
            </div>
            <motion.button
              onClick={() => setIsCreating(true)}
              className="w-6 h-6 flex items-center justify-center text-[#5030E5] hover:bg-[#E4EBFA]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <PlusIcon className="w-[18px] h-[18px] bg-[#b0a8c5] p-0.5 rounded-md " />
            </motion.button>
          </div>

          <span className="mb-6 flex p-[0.5px] w-full bg-[#553C9A]"></span>

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

        <div className="w-[270px] h-[60px] bg-[#f6f7f9] rounded-2xl mt-10 flex items-center justify-center">
          <div className="w-[268px] h-[43px] flex items-center justify-around">
            <Image src={logo} alt="s" className="w-[40px] h-[28px]" />
            <p className=" text-[#553c9a] text-md font-semibold">
              Acolyte Chat Bot
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TodoList;
