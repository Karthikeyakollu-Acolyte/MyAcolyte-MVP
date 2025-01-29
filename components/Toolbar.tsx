import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Film,
  Link2,
  MousePointer2,
  Square,
  Diamond,
  Circle,
  ArrowRight,
  Minus,
} from "lucide-react";
import Image from "next/image";
import pencil from "@/public/penciltool.svg";
import pen from "@/public/pen.svg";
import eraser from "@/public/erasertool.svg";
import marker from "@/public/markertool.svg";
import undo from "@/public/undo.svg";
import redo from "@/public/redo.svg";
import shapes from "@/public/shapestool.svg";
import addtext from "@/public/text.svg";
import menu from "@/public/toolbarmenu.svg";
import { useSettings } from "@/context/SettingsContext";
import ShapeSelector from "./toolbar/ShapeSelector";
import TextMenu from "./toolbar/TextMenu";
import PenMenu from "./toolbar/PenMenu";
import { opacity } from "html2canvas/dist/types/css/property-descriptors/opacity";

interface Tool {
  id: string;
  icon?: JSX.Element;
  type?: "pen" | "highlighter" | "eraser" | "text" | null;
  style?: React.CSSProperties;
  color?: string;
  text?: string;
  className?: string;
}

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const {setActiveTool} = useSettings()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-2 bottom-32 bg-white rounded-xl shadow-lg w-[301px] h-[275px] py-2 z-50"
    >
      <div className="px-4 py-2">
        <button className="w-[266.33px] flex items-center px-2 py-2 hover:bg-[#553C9A] rounded-lg">
          <div className="w-6 h-6 mr-2">
            <svg viewBox="0 0 24 24" className="w-full h-full text-gray-700">
              <path
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
                fill="currentColor"
              />
              <path
                d="M4 11a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z"
                fill="currentColor"
              />
              <path
                d="M4 17a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="text-gray-700">Templates</span>
        </button>

        <button className="w-[266.33px] flex items-center hover:bg-[#553C9A] px-2 rounded-lg py-2">
          <div className="w-6 h-6 mr-2">
            <svg viewBox="0 0 24 24" className="w-full h-full text-gray-700">
              <path
                d="M8 4.5a3.5 3.5 0 117 0v.549c3.06.984 4.5 3.468 4.5 7.451 0 3.088-.714 5.06-1.824 6.373-.937 1.111-2.079 1.525-3.176 1.627v-3.164c.244-.095.454-.224.628-.374.579-.498 1.372-1.573 1.372-4.462 0-3.954-1.196-5.345-3.5-5.345-.654 0-1.156.097-1.523.27-.366-.173-.869-.27-1.523-.27-2.304 0-3.5 1.391-3.5 5.345 0 2.89.793 3.964 1.372 4.462.174.15.384.279.628.374V20.5c-1.097-.102-2.239-.516-3.176-1.627C4.714 17.56 4 15.588 4 12.5c0-3.983 1.44-6.467 4.5-7.451V4.5z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="text-gray-700">Loop Components</span>
        </button>
      </div>

      <div className="px-4 py-2">
        <div className="text-sm text-gray-600 mb-2">Media</div>
        <div className="space-y-1">
          <button className="w-full flex items-center p-2 hover:bg-[#553C9A] rounded-lg" onClick={()=>{
            const tool ={
              id: "image",
            }
            setActiveTool(tool)

          }}>
            <Film className="w-5 h-5 mr-2 text-gray-700" />
            <span className="text-gray-700">Images</span>
          </button>
          <button className="w-full flex items-center p-2 hover:bg-[#553C9A] rounded-lg">
            <Film className="w-5 h-5 mr-2 text-gray-700" />
            <span className="text-gray-700">Videos</span>
          </button>
          <button className="w-full flex items-center p-2 hover:bg-[#553C9A] rounded-lg">
            <Link2 className="w-5 h-5 mr-2 text-gray-700" />
            <span className="text-gray-700">Links</span>
          </button>
        </div>
      </div>
       {/* Pointer */}
       <div className="absolute w-3 h-3 bg-white rotate-45 -bottom-1.5 right-6 shadow-xl"/>
    </div>
  );
};

const ShapeSelectorMenu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`
        fixed right-1 -top-20
        transform
        transition-all duration-200 ease-out
        ${isOpen 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 translate-y-8'
        }
        ${!isOpen && 'pointer-events-none'}
      `}
      ref={menuRef}
    >
      <div 
        className={`
           rounded-xl shadow-lg z-50
          transform
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-4'}
        `}
      >
        <ShapeSelector />
      </div>
    </div>
  );
};

const TextOptionsMenu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`
        fixed left-24 -top-20
        transform
        transition-all duration-300 ease-out
        ${isOpen 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 translate-y-8'
        }
        ${!isOpen && 'pointer-events-none'}
      `}
      ref={menuRef}
    >
      <div 
        className={`
           rounded-xl shadow-lg  z-50
          transform
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-4'}
        `}
      >
        <TextMenu />
      </div>
    </div>
  );
};



const PenOptionsMenu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`
        fixed left-24 -top-20
        transform
        transition-all duration-300 ease-out
        ${isOpen 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 translate-y-8'
        }
        ${!isOpen && 'pointer-events-none'}
      `}
      ref={menuRef}
    >
      <div 
        className={`
           rounded-xl shadow-lg  z-50
          transform
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-4'}
        `}
      >
        <PenMenu />
      </div>
    </div>
  );
};


const Toolbar = () => {
  const [hoveredTool, setHoveredTool] = useState(null);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [shapesMenuOpen, setShapesMenuOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  // const [selectedColor, setSelectedColor] = useState("#000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { setActiveTool,selectedColor, setSelectedColor,activeTool } = useSettings();
  const [TextMenuOpen, setTextMenuOpen] = useState(false);
  const [PenMenuOpen, setPenMenuOpen] = useState(false)

  // Update tool colors when selected color changes
  useEffect(() => {
    if (selectedTool) {
      const updatedTool = {
        ...selectedTool,
        color: selectedColor,
      };
      setSelectedTool(updatedTool);
      setActiveTool(selectedTool);
    }
  }, [selectedColor]);

  const tools = [
    {
      id: "undo",
      icon: (
        <Image
          src={undo}
          className="text-gray-600 w-[28px] h-[28px]"
          alt={""}
        />
      ),
    },
    {
      id: "redo",
      icon: (
        <Image
          src={redo}
          className="text-gray-600 w-[28px] h-[28px]"
          alt={""}
        />
      ),
    },
    {
      id: "highlighter",
      type: "pen",
      icon: <Image src={marker} className="text-gray-600 h-[133px]" alt={""} />,
      style: {
        background: "#fff",
        border: `2px solid ${selectedColor}`,
        borderRadius: "1px",
      },
      color: selectedColor,
      strokeWidth:4,
      opacity:50
    },
    {
      id: "pencil",
      type: "pen",
      icon: <Image src={pencil} className="text-gray-600 h-[133px]" alt={""} />,
      style: {
        background: "#fff",
        border: `2px solid ${selectedColor}`,
        borderRadius: "1px",
      },
      color: selectedColor,
      strokeWidth:2,
      opacity:90
    },
    {
      id: "pen",
      type: "pen",
      icon: <Image src={pen} className="text-gray-600 h-[133px]" alt={""} />,
      style: {
        background: "#fff",
        border: `2px solid ${selectedColor}`,
        borderRadius: "1px",
      },
      color: selectedColor,
      strokeWidth:1,
      opacity:100
    },
    {
      id: "objectEraser",
      type: "pen",
      icon: <Image src={eraser} className="text-gray-600 h-[133px]" alt={""} />,
      style: {
        background: "#fff",
        border: `2px solid ${selectedColor}`,
        borderRadius: "1px",
      },
      color: selectedColor,
      strokeWidth:1,
    },
    
    {
      id: "shapes",
      icon: <Image src={shapes} alt="" className="w-[29px] h-[29px]" />,
      className: "text-gray-600 font-medium",
      color: selectedColor,
    },
    {
      id: "text",
      icon: <Image src={addtext} alt="" className="w-[29px] h-[29px]" />,
      className: "text-gray-600",
      color: selectedColor,
    },
  ];

  const renderTool = (tool) => {
    if (tool.icon) {
      return tool.icon;
    }
    if (tool.text) {
      return <span className={tool.className}>{tool.text}</span>;
    }
  };

  const toolsByType = {
    undoRedo: tools.filter((tool) => tool.id === "undo" || tool.id === "redo"),
    markers: tools.filter(
      (tool) => tool.type === "pen" || tool.id === "objectEraser"
    ),
    shapesAndText: tools.filter(
      (tool) => tool.id === "text" || tool.id === "shapes"
    ),
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (selectedTool && selectedTool.type === "pen") {
      const updatedTool = {
        ...activeTool,
        color: color,
        style: {
          ...selectedTool.style,
          border: `2px solid ${color}`,
        },
      };
      setSelectedTool(updatedTool);
    }
  };

  return (
    <div className="fixed bottom-9 left-1/2 transform -translate-x-1/2  font-sans" style={{zIndex:10}}>
      <div className="bg-[#F6F6F6] w-[532px] h-[87px] rounded-full overflow-hidden pl-6 flex gap-3 max-w-2xl mx-auto shadow-2xl">
        {/* Undo and Redo */}
        <div className="flex items-center gap-3">
          {toolsByType.undoRedo.map((tool) => (
            <button
              key={tool.id}
              className="rounded-full hover:bg-gray-100 transition-colors duration-200"
              onMouseEnter={() => setHoveredTool(tool.id)}
              onMouseLeave={() => setHoveredTool(null)}
              onClick={() => setActiveTool(tool)}
            >
              {renderTool(tool)}
            </button>
          ))}
        </div>

        {/* Markers */}
        <div className="flex items-center -mb-16">
          {toolsByType.markers.map((tool) => (
            <div
              key={tool.id}
              className={`relative transition-transform duration-300 ease-in-out ${
                hoveredTool === tool.id || selectedTool?.id === tool.id
                  ? "-translate-y-4"
                  : ""
              }`}
            >
              <button
                className="rounded-full pt-3"
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
                onClick={() => {
                  
                  setSelectedTool(tool);
                  setActiveTool(tool);
                  if(tool.id ==="objectEraser") return
                  
                  setPenMenuOpen(true)
                }}
              >
                {renderTool(tool)}
              </button>
            </div>
          ))}
        </div>

        {/* Colors */}
        <div className="flex flex-col items-center justify-center gap-1 mr-2">
          <div className="flex items-center gap-2 mb-2">
            {["#000", "#228be6", "#40c057"].map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorChange(color)}
                className={`rounded-full p-1 hover:bg-gray-100 transition-colors duration-200 ${
                  selectedColor === color
                    ? "ring-2 ring-offset-2 ring-blue-500"
                    : ""
                }`}
                style={{
                  backgroundColor: color,
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {["#ffd43b", "#fa5252"].map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorChange(color)}
                className={`rounded-full p-1 hover:bg-gray-100 transition-colors duration-200 ${
                  selectedColor === color
                    ? "ring-2 ring-offset-2 ring-blue-500"
                    : ""
                }`}
                style={{
                  backgroundColor: color,
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                }}
              />
            ))}
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="rounded-full p-1 hover:bg-gray-100 transition-colors duration-200 w-7 h-7 flex items-center justify-center"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500" />
            </button>
            {showColorPicker && (
              <div className="absolute bottom-24 bg-white rounded-lg shadow-lg p-2">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-32 h-32"
                />
              </div>
            )}
          </div>
        </div>

        {/* Shapes and Text */}
        <div className="flex flex-col justify-center items-center gap-1.5">
          {toolsByType.shapesAndText.map((tool) => (
            <button
              key={tool.id}
              className="rounded-full hover:bg-gray-100 transition-colors pt-1 duration-200"
              onClick={() => {
                setSelectedTool(tool);
                if(tool.id==="shapes"){
                  setShapesMenuOpen(true);

                }else{
                  setTextMenuOpen(true)
                  
                  setActiveTool(tool);
                }
               
              }}
            >
              {renderTool(tool)}
            </button>
          ))}
        </div>

        {/* Menu */}
        <button
          className="rounded-full hover:bg-gray-100 mr-4 -ml-2"
          onClick={() => setMoreMenuOpen(!moreMenuOpen)}
        >
          <Image src={menu} alt={""} className="w-[28px] h-[28px]" />
        </button>
      </div>

      <Menu isOpen={moreMenuOpen} onClose={() => setMoreMenuOpen(false)} />
      <ShapeSelectorMenu isOpen={shapesMenuOpen} onClose={() => setShapesMenuOpen(false)} />
      <TextOptionsMenu isOpen={TextMenuOpen} onClose={() => setTextMenuOpen(false)} />
      <PenOptionsMenu isOpen={PenMenuOpen} onClose={() => setPenMenuOpen(false)} />
      
    </div>
  );
};

export default Toolbar;





// const ShapesMenu = () => {
//   const { setActiveTool } = useSettings();
//   const tools: Tool[] = [
//     {
//       id: 'rectangleSelection',
//       icon: <MousePointer2 className="w-5 h-5" />,
//       type: null,
//       text: 'rectangleSelection'
//     },
//     {
//       id: 'square',
//       icon: <Square className="w-5 h-5" />,
//       type: 'pen',
//       color: '#000000',
//       text: 'Square'
//     },
//     {
//       id: 'diamond',
//       icon: <Diamond className="w-5 h-5" />,
//       type: 'pen',
//       color: '#000000',
//       text: 'Diamond'
//     },
//     {
//       id: 'circle',
//       icon: <Circle className="w-5 h-5" />,
//       type: 'pen',
//       color: '#000000',
//       text: 'Circle'
//     },
//     {
//       id: 'arrow',
//       icon: <ArrowRight className="w-5 h-5" />,
//       type: 'pen',
//       color: '#000000',
//       text: 'Arrow'
//     },
//     {
//       id: 'line',
//       icon: <Minus className="w-5 h-5" />,
//       type: 'pen',
//       color: '#000000',
//       text: 'Line'
//     }
//   ];

//   return (
//     <div className="flex items-center gap-2 bg-white  rounded-lg">
//       {tools.map((tool) => (
//         <button
//           key={tool.id}
//           className={`p-2 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center justify-center ${tool.className || ''}`}
//           title={tool.text}
//           style={tool.style}
//           onClick={()=>{setActiveTool(tool)}}
//         >
//           {tool.icon}
//         </button>
//       ))}
//     </div>
//   );
// };
