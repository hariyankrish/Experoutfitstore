import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import CanvasEditor from "./canvas-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, Download, Save, ShoppingCart, Palette, RotateCcw, Trash2 } from "lucide-react";

interface DesignData {
  elements: Array<{
    id: string;
    type: 'image' | 'text';
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  }>;
}

export default function DesignStudio() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [designData, setDesignData] = useState<DesignData>({ elements: [] });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [designSettings, setDesignSettings] = useState({
    name: '',
    productType: 'tshirt',
    color: 'black',
    size: 'M',
    placement: 'front',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const productTypes = [
    { value: 'tshirt', label: 'T-Shirt', basePrice: 24.99 },
    { value: 'hoodie', label: 'Hoodie', basePrice: 49.99 },
    { value: 'tank', label: 'Tank Top', basePrice: 19.99 },
    { value: 'longsleeve', label: 'Long Sleeve', basePrice: 29.99 },
  ];

  const colors = ['black', 'white', 'navy', 'gray', 'red', 'blue', 'green'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const placements = [
    { value: 'front', label: 'Front' },
    { value: 'back', label: 'Back' },
    { value: 'left-sleeve', label: 'Left Sleeve' },
    { value: 'right-sleeve', label: 'Right Sleeve' },
  ];

  const getCurrentPrice = () => {
    const basePrice = productTypes.find(p => p.value === designSettings.productType)?.basePrice || 24.99;
    const designComplexity = designData.elements.length * 2; // $2 per element
    return basePrice + designComplexity;
  };

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await apiRequest("POST", "/api/remove-background", formData);
      return response.json();
    },
    onSuccess: (result) => {
      if (result.success) {
        const newElement = {
          id: `img-${Date.now()}`,
          type: 'image' as const,
          content: `data:image/png;base64,${result.imageData}`,
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          rotation: 0,
        };
        setDesignData(prev => ({
          elements: [...prev.elements, newElement]
        }));
        toast({
          title: "Image Added",
          description: "Background removed automatically using AI",
        });
      } else {
        // Fallback to original image if background removal fails
        const reader = new FileReader();
        reader.onload = (e) => {
          const newElement = {
            id: `img-${Date.now()}`,
            type: 'image' as const,
            content: e.target?.result as string,
            x: 100,
            y: 100,
            width: 200,
            height: 200,
            rotation: 0,
          };
          setDesignData(prev => ({
            elements: [...prev.elements, newElement]
          }));
        };
        reader.readAsDataURL(file);
        toast({
          title: "Image Added",
          description: "Added without background removal",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Save design mutation
  const saveDesignMutation = useMutation({
    mutationFn: async (saveData: any) => {
      const response = await apiRequest("POST", "/api/custom-designs", saveData);
      return response.json();
    },
    onSuccess: (design) => {
      toast({
        title: "Design Saved",
        description: "Your custom design has been saved successfully.",
      });
      setDesignSettings(prev => ({ ...prev, name: design.name }));
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Save Failed",
        description: "Failed to save design. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }
      setIsProcessing(true);
      uploadImageMutation.mutate(file);
      setIsProcessing(false);
    }
  };

  const handleAddText = () => {
    const newElement = {
      id: `text-${Date.now()}`,
      type: 'text' as const,
      content: 'Your Text Here',
      x: 150,
      y: 150,
      width: 200,
      height: 50,
      rotation: 0,
    };
    setDesignData(prev => ({
      elements: [...prev.elements, newElement]
    }));
  };

  const handleElementUpdate = (elementId: string, updates: Partial<typeof designData.elements[0]>) => {
    setDesignData(prev => ({
      elements: prev.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      )
    }));
  };

  const handleDeleteElement = (elementId: string) => {
    setDesignData(prev => ({
      elements: prev.elements.filter(el => el.id !== elementId)
    }));
    if (selectedElement === elementId) {
      setSelectedElement(null);
    }
  };

  const handleSaveDesign = () => {
    if (!designSettings.name.trim()) {
      toast({
        title: "Missing Name",
        description: "Please enter a name for your design.",
        variant: "destructive",
      });
      return;
    }

    const saveData = {
      name: designSettings.name,
      designData,
      productType: designSettings.productType,
      color: designSettings.color,
      size: designSettings.size,
      placement: designSettings.placement,
      price: getCurrentPrice().toFixed(2),
    };

    saveDesignMutation.mutate(saveData);
  };

  const handleAddToCart = () => {
    if (designData.elements.length === 0) {
      toast({
        title: "Empty Design",
        description: "Please add some elements to your design first.",
        variant: "destructive",
      });
      return;
    }

    const cartItem = {
      id: `custom-${Date.now()}`,
      name: designSettings.name || `Custom ${designSettings.productType}`,
      price: getCurrentPrice(),
      variant: {
        color: designSettings.color,
        size: designSettings.size,
        placement: designSettings.placement,
      },
    };

    addItem(cartItem);
    toast({
      title: "Added to Cart",
      description: "Your custom design has been added to your cart.",
    });
  };

  const selectedElementData = selectedElement 
    ? designData.elements.find(el => el.id === selectedElement)
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Design Canvas */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Design Canvas</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setDesignData({ elements: [] })}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
                <Button variant="outline" size="sm" onClick={handleSaveDesign} disabled={saveDesignMutation.isPending}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CanvasEditor
              designData={designData}
              selectedElement={selectedElement}
              productType={designSettings.productType}
              color={designSettings.color}
              placement={designSettings.placement}
              onElementSelect={setSelectedElement}
              onElementUpdate={handleElementUpdate}
              onElementDelete={handleDeleteElement}
            />
          </CardContent>
        </Card>
      </div>

      {/* Tools & Settings */}
      <div className="lg:col-span-2 space-y-6">
        {/* Add Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Add Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleFileUpload} 
                disabled={isProcessing || uploadImageMutation.isPending}
                className="h-20 flex-col"
              >
                <Upload className="h-6 w-6 mb-2" />
                Upload Image
              </Button>
              <Button onClick={handleAddText} variant="outline" className="h-20 flex-col">
                <Palette className="h-6 w-6 mb-2" />
                Add Text
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Element Properties */}
        {selectedElementData && (
          <Card>
            <CardHeader>
              <CardTitle>Element Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedElementData.type === 'text' && (
                <div>
                  <Label htmlFor="text-content">Text Content</Label>
                  <Input
                    id="text-content"
                    value={selectedElementData.content}
                    onChange={(e) => handleElementUpdate(selectedElement!, { content: e.target.value })}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="element-x">X Position</Label>
                  <Input
                    id="element-x"
                    type="number"
                    value={selectedElementData.x}
                    onChange={(e) => handleElementUpdate(selectedElement!, { x: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="element-y">Y Position</Label>
                  <Input
                    id="element-y"
                    type="number"
                    value={selectedElementData.y}
                    onChange={(e) => handleElementUpdate(selectedElement!, { y: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="element-width">Width</Label>
                  <Input
                    id="element-width"
                    type="number"
                    value={selectedElementData.width}
                    onChange={(e) => handleElementUpdate(selectedElement!, { width: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="element-height">Height</Label>
                  <Input
                    id="element-height"
                    type="number"
                    value={selectedElementData.height}
                    onChange={(e) => handleElementUpdate(selectedElement!, { height: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="element-rotation">Rotation (degrees)</Label>
                <Input
                  id="element-rotation"
                  type="number"
                  value={selectedElementData.rotation}
                  onChange={(e) => handleElementUpdate(selectedElement!, { rotation: parseInt(e.target.value) })}
                />
              </div>

              <Button 
                variant="destructive" 
                onClick={() => handleDeleteElement(selectedElement!)}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Element
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Product Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Product Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="design-name">Design Name</Label>
              <Input
                id="design-name"
                placeholder="My Awesome Design"
                value={designSettings.name}
                onChange={(e) => setDesignSettings(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="product-type">Product Type</Label>
              <Select value={designSettings.productType} onValueChange={(value) => setDesignSettings(prev => ({ ...prev, productType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label} - ${type.basePrice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="product-color">Color</Label>
              <Select value={designSettings.color} onValueChange={(value) => setDesignSettings(prev => ({ ...prev, color: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colors.map(color => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: color === 'white' ? '#ffffff' : color === 'black' ? '#000000' : color }}
                        />
                        <span className="capitalize">{color}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product-size">Size</Label>
                <Select value={designSettings.size} onValueChange={(value) => setDesignSettings(prev => ({ ...prev, size: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="product-placement">Placement</Label>
                <Select value={designSettings.placement} onValueChange={(value) => setDesignSettings(prev => ({ ...prev, placement: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {placements.map(placement => (
                      <SelectItem key={placement.value} value={placement.value}>
                        {placement.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price & Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Price:</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  ${getCurrentPrice().toFixed(2)}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Button 
                  onClick={handleAddToCart} 
                  className="w-full bg-black text-white hover:bg-neutral-800"
                  disabled={designData.elements.length === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSaveDesign}
                  disabled={saveDesignMutation.isPending}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saveDesignMutation.isPending ? 'Saving...' : 'Save Design'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
