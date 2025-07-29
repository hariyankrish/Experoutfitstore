import { useRef, useEffect, useState } from "react";

interface CanvasElement {
  id: string;
  type: 'image' | 'text';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface CanvasEditorProps {
  designData: { elements: CanvasElement[] };
  selectedElement: string | null;
  productType: string;
  color: string;
  placement: string;
  onElementSelect: (id: string | null) => void;
  onElementUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onElementDelete: (id: string) => void;
}

export default function CanvasEditor({
  designData,
  selectedElement,
  productType,
  color,
  placement,
  onElementSelect,
  onElementUpdate,
  onElementDelete,
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragElement, setDragElement] = useState<string | null>(null);

  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 500;

  // Get mockup image based on product type and color
  const getMockupImage = () => {
    // In a real app, you'd have different mockup images for each product type and color
    const mockups = {
      tshirt: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
      hoodie: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
      tank: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
      longsleeve: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
    };
    return mockups[productType as keyof typeof mockups] || mockups.tshirt;
  };

  useEffect(() => {
    drawCanvas();
  }, [designData, selectedElement, productType, color, placement]);

  const drawCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background pattern for transparency
    drawTransparencyPattern(ctx);

    // Load and draw mockup if available
    try {
      const mockupImg = new Image();
      mockupImg.crossOrigin = 'anonymous';
      mockupImg.onload = () => {
        ctx.drawImage(mockupImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawElements(ctx);
      };
      mockupImg.onerror = () => {
        // If mockup fails to load, just draw elements on transparent background
        drawElements(ctx);
      };
      mockupImg.src = getMockupImage();
    } catch (error) {
      drawElements(ctx);
    }
  };

  const drawTransparencyPattern = (ctx: CanvasRenderingContext2D) => {
    const patternSize = 20;
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.fillStyle = '#e0e0e0';
    for (let x = 0; x < CANVAS_WIDTH; x += patternSize) {
      for (let y = 0; y < CANVAS_HEIGHT; y += patternSize) {
        if ((x / patternSize + y / patternSize) % 2 === 0) {
          ctx.fillRect(x, y, patternSize, patternSize);
        }
      }
    }
  };

  const drawElements = async (ctx: CanvasRenderingContext2D) => {
    for (const element of designData.elements) {
      ctx.save();

      // Apply transformations
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);

      if (element.type === 'image') {
        try {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, element.x, element.y, element.width, element.height);
            
            // Draw selection border if selected
            if (selectedElement === element.id) {
              drawSelectionBorder(ctx, element);
            }
          };
          img.src = element.content;
        } catch (error) {
          // Draw placeholder for failed images
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(element.x, element.y, element.width, element.height);
          ctx.strokeStyle = '#ccc';
          ctx.strokeRect(element.x, element.y, element.width, element.height);
          
          ctx.fillStyle = '#999';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Image', element.x + element.width / 2, element.y + element.height / 2);
        }
      } else if (element.type === 'text') {
        ctx.fillStyle = '#000';
        ctx.font = `${Math.min(element.height, 32)}px Arial`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        // Word wrap for text
        const words = element.content.split(' ');
        const lines = [];
        let currentLine = '';
        const maxWidth = element.width;
        
        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) {
          lines.push(currentLine);
        }

        const lineHeight = Math.min(element.height / lines.length, 32);
        lines.forEach((line, index) => {
          ctx.fillText(line, element.x, element.y + index * lineHeight);
        });

        // Draw selection border if selected
        if (selectedElement === element.id) {
          drawSelectionBorder(ctx, element);
        }
      }

      ctx.restore();
    }
  };

  const drawSelectionBorder = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(element.x - 2, element.y - 2, element.width + 4, element.height + 4);
    ctx.setLineDash([]);

    // Draw resize handles
    const handleSize = 8;
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(element.x - handleSize / 2, element.y - handleSize / 2, handleSize, handleSize);
    ctx.fillRect(element.x + element.width - handleSize / 2, element.y - handleSize / 2, handleSize, handleSize);
    ctx.fillRect(element.x - handleSize / 2, element.y + element.height - handleSize / 2, handleSize, handleSize);
    ctx.fillRect(element.x + element.width - handleSize / 2, element.y + element.height - handleSize / 2, handleSize, handleSize);
  };

  const getElementAtPosition = (x: number, y: number): string | null => {
    // Check elements in reverse order (top to bottom)
    for (let i = designData.elements.length - 1; i >= 0; i--) {
      const element = designData.elements[i];
      if (
        x >= element.x &&
        x <= element.x + element.width &&
        y >= element.y &&
        y <= element.y + element.height
      ) {
        return element.id;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * CANVAS_WIDTH) / rect.width;
    const y = ((e.clientY - rect.top) * CANVAS_HEIGHT) / rect.height;

    const elementId = getElementAtPosition(x, y);
    
    if (elementId) {
      onElementSelect(elementId);
      setIsDragging(true);
      setDragStart({ x, y });
      setDragElement(elementId);
    } else {
      onElementSelect(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * CANVAS_WIDTH) / rect.width;
    const y = ((e.clientY - rect.top) * CANVAS_HEIGHT) / rect.height;

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    const element = designData.elements.find(el => el.id === dragElement);
    if (element) {
      onElementUpdate(dragElement, {
        x: Math.max(0, Math.min(CANVAS_WIDTH - element.width, element.x + deltaX)),
        y: Math.max(0, Math.min(CANVAS_HEIGHT - element.height, element.y + deltaY)),
      });
    }

    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragElement(null);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedElement && (e.key === 'Delete' || e.key === 'Backspace')) {
      onElementDelete(selectedElement);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement]);

  return (
    <div 
      ref={containerRef}
      className="design-canvas has-mockup relative w-full max-w-md mx-auto"
      style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full h-full border border-neutral-300 rounded-lg cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {/* Design Info Overlay */}
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs">
        <span className="capitalize">{productType}</span> • <span className="capitalize">{color}</span> • {placement}
      </div>

      {/* Element Count */}
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs">
        {designData.elements.length} element{designData.elements.length !== 1 ? 's' : ''}
      </div>

      {/* Instructions */}
      {designData.elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-neutral-500">
            <p className="text-sm">Drop your design elements here</p>
            <p className="text-xs">Upload images or add text to get started</p>
          </div>
        </div>
      )}
    </div>
  );
}
