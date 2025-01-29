"use client";
import {
  Home,
  MessageSquare,
  ListTodo,
  Users2,
  Settings,
  File,
  FileText,
  ChevronRight,
  ChevronDown,
  Plus,
  MoreVertical,
  Upload,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getFileSystem } from "@/db/pdf/fileSystem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import FolderTree1 from "./FolderTree-1";
import { FileUploadWrapper } from "./file-upload";
import FileNote from "@/public/noteplain.svg";
import PdfFile from "@/public/pdf-file.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import home from '@/public/home.svg'
import mypdf from '@/public/mypdf.svg'
import notes from '@/public/mynotes.svg'
import community from '@/public/community.svg'
import acolytechat from '@/public/acolytechat.svg'


const menuItems = [
  { id: "home", label: "Home", href: "/dashboard", Icon: home },
  {
    id: "PdfNotes",
    label: "My Pdf",
    href: "/dashboard/pdf",
    Icon: mypdf,
    hasDropdown: true,
    type: "pdf",
  },
  {
    id: "notes",
    label: "My Notes",
    href: "/dashboard/notes",
    Icon: notes,
    hasDropdown: true,
    type: "note",
  },
  { id: "community", label: "Community", href: "/dashboard/settings", Icon: community },
  {
    id: "chat",
    label: "Acolyte",
    href: "/chat",
    Icon: acolytechat,
  },
];

const dropdownVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: -5,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
      ease: "easeOut",
    },
  }),
};



export function SidebarNav() {
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [fileType, setFileType] = useState<"note"| "pdf">()
  const router = useRouter();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const data = await getFileSystem();
        const formattedData = formatFolderStructure(data);
        setFolders(formattedData);
      } catch (error) {
        console.error("Error fetching folders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  const formatFolderStructure = (data) => {
    const folderMap = {};
    const rootFolders = [];

    data.forEach((item) => {
      folderMap[item.id] = {
        ...item,
        isOpen: false,
        isActive: false,
        files: [],
      };
    });

    data.forEach((item) => {
      if (item.parentId) {
        folderMap[item.parentId].files.push(folderMap[item.id]);
      } else {
        rootFolders.push(folderMap[item.id]);
      }
    });

    return rootFolders;
  };

  const getRecentFiles = (type) => {
    const allFiles = [];
    const traverseFolder = (folder) => {
      // Check files array for matching fileType
      folder.files.forEach((file) => {
        if (
          file.type === "file" &&
          file.fileType === (type === "pdf" ? "pdf" : "note")
        ) {
          allFiles.push(file);
        }
        // Continue traversing if the file has nested files
        if (file.files && file.files.length > 0) {
          traverseFolder(file);
        }
      });
    };

    folders.forEach(traverseFolder);
    return allFiles.slice(0, 3); // Return only the 3 most recent files
  };

  const handelOpenDocs = (route) => {
      // Relative path, navigate within the Next.js app
      router.push(route);

  };
  
  const baseLinkStyles =
    "w-[249px] h-[39px] flex items-center gap-3 px-3 py-2 text-lg font-rubik rounded-lg";
  const activeLinkStyles = "bg-purple-50 text-purple-600";
  const inactiveLinkStyles = "text-gray-600 hover:bg-gray-50";

  const renderDropdownItems = (type) => {
    const recentFiles = getRecentFiles(type);

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={dropdownVariants}
        className="overflow-hidden"
      >
        <div className="ml-8 mt-1 space-y-1">
            <div className="flex items-center justify-start gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
            onClick={()=>{
              setIsOpen(true);
              setFileType(type)
            }}
            >
              <Plus className="w-4 h-4" /> Create New
            </div>

          {recentFiles.map((file, index) => (
            <motion.div key={file.id} custom={index} variants={itemVariants}>
              <div
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={()=>{handelOpenDocs(`/${type === "pdf" ? "/pdfnote" : "/note"}/${file.id}`)}}
              >
                <Image
                  className={`w-4 h-4`}
                  src={ type === "pdf" ? PdfFile : FileNote}
                  alt="s"
                />
                <span className="truncate">{file.name}</span>
              </div>
            </motion.div>
          ))}
          <motion.div custom={recentFiles.length} variants={itemVariants}>
            <div

              onClick={()=>{handelOpenDocs(`/dashboard/${type === "pdf" ? "pdf" : "notes"}`)}}
              className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              {/* <Plus className="w-4 h-4" /> */}
              <span>View All</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="w-[270px] min-h-screen border-r bg-white mt-3">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-[275px] h-[1113px] border-r  mt-3">

      {isOpen && <FileUploadWrapper isUploadPdf={isOpen} setIsOpen={setIsOpen} fileType={fileType}/>}

      <div className="px-3 py-4">
        <nav className="space-y-2 font-medium">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredMenu(item.id)}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <Link
                href={item.href}
                onClick={() => setSelectedMenu(item.id)}
                className={`${baseLinkStyles} ${
                  selectedMenu === item.id
                    ? activeLinkStyles
                    : inactiveLinkStyles
                }`}
              >
                <Image src={item.Icon} className="w-5 h-5" alt={""} />
                {item.label}
              </Link>
              <AnimatePresence>
                {item.hasDropdown &&
                  hoveredMenu === item.id &&
                  renderDropdownItems(item.type)}
              </AnimatePresence>
            </div>
          ))}
        </nav>
        <div className="mt-8">
          <FolderTree1 />
        </div>
      </div>
    </div>
  );
}
