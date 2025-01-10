import { useRef } from "react";
import { fabric } from "fabric";

export default function DragAndDropTool({ fabricCanvas, items }) {
    const dragItemRef = useRef(null);

    const handleDragStart = (e, item) => {
        dragItemRef.current = item;
    };

    const handleDragOver = (e) => {
        // Prevent default to allow dropping
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent propagation to parent elements

        if (!fabricCanvas || !dragItemRef.current) return;

        const rect = fabricCanvas.upperCanvasEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const item = dragItemRef.current;

        if (item.type === "image") {
            fabric.Image.fromURL(item.src, (img) => {
                img.set({
                    left: x,
                    top: y,
                    scaleX: 0.5,
                    scaleY: 0.5,
                });
                fabricCanvas.add(img);
                fabricCanvas.renderAll();
            });
        } else if (item.type === "icon") {
            const text = new fabric.Text(item.label, {
                left: x,
                top: y,
                fontSize: 24,
                fill: "black",
            });
            fabricCanvas.add(text);
            fabricCanvas.renderAll();
        }
        dragItemRef.current = null; // Reset the reference
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                border: "1px solid #ccc",
                padding: "10px",
                position:"absolute",
                right:"-500px",
                zIndex:"999"
            }}
        >
            {/* Draggable Items */}
            {items.map((item, index) => (
                <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    style={{
                        cursor: "grab",
                        padding: "5px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        background: "#f9f9f9",
                        textAlign: "center",
                    }}
                >
                    {item.type === "image" ? (
                        <img
                            src={item.src}
                            alt="icon"
                            style={{ width: "40px", height: "40px" }}
                        />
                    ) : (
                        <span>{item.label}</span>
                    )}
                </div>
            ))}

            {/* Drop Target */}
            <div
                style={{
                    flex: 1,
                    minHeight: "200px",
                    border: "1px dashed #aaa",
                    marginLeft: "10px",
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <p style={{ textAlign: "center", color: "#aaa" }}>
                    Drag items here and drop them on the canvas
                </p>
            </div>
        </div>
    );
}
