import { MoreHorizontal, MessageSquare, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function TasksSidebar() {
  const tasks = [
    {
      priority: 'Low',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      title: 'Brainstorming',
      description: "Brainstorming brings team members' diverse experience into play.",
      comments: 12,
      files: 0,
      avatars: 3,
    },
    {
      priority: 'High',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      title: 'Research',
      description: 'User research helps you to create an optimal product for users.',
      comments: 10,
      files: 3,
      avatars: 2,
    },
    {
      priority: 'High',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      title: 'Wireframes',
      description: 'Low fidelity wireframes include the most basic content and visuals.',
      comments: 2,
      files: 0,
      avatars: 3,
    },
  ];

  return (
    <div className="w-[380px] font-rubik ">
      {/* Filters at the top */}
      <div className="p-4 flex items-center justify-end gap-2">
        <Select defaultValue="filter">
          <SelectTrigger className="w-[122px] h-[40px] text-md border-l border-slate-600 rounded-lg">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="today">
          <SelectTrigger className="w-[122px] h-[40px] text-md border-l border-slate-600 rounded-lg mr-3">
            <SelectValue placeholder="Today" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* To Do section */}
      <div className="p-6 w-[354px] h-[861px] bg-[#F6F7F9] rounded-xl flex flex-col justify-start items-center space-y-4">
        <div className="flex items-center justify-between mb-4 w-full">
          <h2 className="text-lg font-semibold">
            To Do <span className="text-sm text-gray-500">{tasks.length}</span>
          </h2>
          <button className="text-purple-500 hover:text-purple-600">+</button>
        </div>

        {/* Task Cards */}
        <div className="flex flex-col space-y-4 w-full">
          {tasks.map((task, index) => (
            <div key={index} className="bg-white rounded-2xl border w-[314px] h-[177px] p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className={`inline-block px-2 py-1 text-xs font-medium ${task.bgColor} ${task.textColor} rounded`}>
                    {task.priority}
                  </div>
                  <h3 className="text-base font-medium mt-2">{task.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {Array.from({ length: task.avatars }).map((_, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-white bg-gray-200"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-5 h-5" />
                    {task.comments} comments
                  </div>
                  <div className="flex items-center gap-1">
                    <Paperclip className="w-5 h-5" />
                    {task.files} files
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
