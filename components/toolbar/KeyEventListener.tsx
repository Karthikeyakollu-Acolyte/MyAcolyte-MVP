import { useToolContext } from '@/context/ToolContext';
import { useEffect } from 'react';

const KeyEventListener = ({
    fabricCanvas
}: {
    fabricCanvas: any;
}) => {
    const {setSelectedTool,selectedTool} =useToolContext()
    let prevTool = selectedTool
    useEffect(() => {
        if (!fabricCanvas.current) return;
        const canvas = fabricCanvas.current;

        // Add keydown and keyup event listeners
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 's') {
                // Switch to selection mode when 's' is pressed
                setSelectedTool(null)
                canvas.isDrawingMode = false;
                canvas.selection = true; // Enable object selection
                console.log(e.key)
                
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 's') {
                // Switch back to drawing mode when 's' key is released
                  setSelectedTool(prevTool)
                    canvas.isDrawingMode = false; // Re-enable drawing mode

                canvas.selection = false; // Disable object selection
            }
        };

        // Attach keydown and keyup event listeners to document
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        // Cleanup event listeners when the component is unmounted
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, [fabricCanvas]);

    return null;
};

export default KeyEventListener;
