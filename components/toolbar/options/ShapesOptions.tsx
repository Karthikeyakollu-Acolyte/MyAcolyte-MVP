import { useState, useEffect } from 'react';
import { Circle, Square, Triangle, Star, Diamond, X,MoveUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Import UI components you are using
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ShapesOptionsProps {
    onClose: () => void;
    onToolChange: (shape: "circle" | "square" | "triangle" | "star" | "diamond" | "shapes"|"arrow") => void;
    initialTool: "circle" | "square" | "triangle" | "star" | "diamond" | "shapes"|"arrow";
    setColor: (color: string) => void;
}

export default function ShapesOptions({
    onClose,
    onToolChange,
    initialTool,
    setColor,
}: ShapesOptionsProps) {
    const [shape, setShape] = useState(initialTool);

    // Update the parent about the current shape when it changes
    useEffect(() => {
        onToolChange(shape);
        console.log(shape)
    }, [shape, onToolChange]);

    return (
        <div className="flex items-center space-x-2">
            {/* Close Button */}
            <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
            </Button>

            {/* Shape Toggle Group */}
            <ToggleGroup type="single" value={shape} onValueChange={(value) => value && setShape(value as "circle" | "square" | "triangle" | "star" | "diamond")}>
                <ToggleGroupItem value="circle">
                    <Circle className="h-6 w-6" />
                </ToggleGroupItem>
                <ToggleGroupItem value="square">
                    <Square className="h-6 w-6" />
                </ToggleGroupItem>
                <ToggleGroupItem value="triangle">
                    <Triangle className="h-6 w-6" />
                </ToggleGroupItem>
                <ToggleGroupItem value="star">
                    <Star className="h-6 w-6" />
                </ToggleGroupItem>
                <ToggleGroupItem value="hexagon">
                    <Diamond className="h-6 w-6" />
                </ToggleGroupItem>

                {/* <ToggleGroupItem value="arrow">
                    <MoveUpRight className="h-6 w-6" />
                </ToggleGroupItem> */}
            </ToggleGroup>

            {/* Color Picker (if needed) */}
            {/* <input
                type="color"
                onChange={(e) => setColor(e.target.value)}
                className="ml-2 h-6 w-6 border rounded"
            /> */}
        </div>
    );
}
