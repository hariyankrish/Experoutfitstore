import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CartSidebar from "@/components/cart/cart-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Package, Palette, Settings, Download, Eye } from "lucide-react";
import { Link } from "wouter";

export default function Account() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Parse URL params for tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access your account.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  const { data: customDesigns = [], isLoading: designsLoading } = useQuery({
    queryKey: ["/api/custom-designs", { userId: user?.id }],
    enabled: isAuthenticated && !!user?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'printing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold mb-4">My Account</h1>
            <p className="text-neutral-600 mb-6">
              Please sign in to access your account dashboard.
            </p>
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="w-full bg-black text-white hover:bg-neutral-800"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onCartOpen={() => setIsCartOpen(true)} />

      {/* Breadcrumb */}
      <div className="bg-neutral-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <span>Home</span>
            <span>/</span>
            <span className="text-black font-medium">My Account</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-neutral-500" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-black">
                Welcome back, {user?.firstName || 'User'}!
              </h1>
              <p className="text-neutral-600">
                Manage your orders, designs, and account settings
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="designs" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>My Designs</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Email</label>
                    <p className="text-neutral-900">{user?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Name</label>
                    <p className="text-neutral-900">
                      {user?.firstName || user?.lastName 
                        ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
                        : 'Not provided'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Member Since</label>
                    <p className="text-neutral-900">
                      {user?.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'Recently'
                      }
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Total Orders</span>
                    <span className="font-medium">{orders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Custom Designs</span>
                    <span className="font-medium">{customDesigns.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Account Status</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Quick Actions</p>
                    <div className="space-y-2">
                      <Link href="/design">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Create New Design
                        </Button>
                      </Link>
                      <Link href="/shop">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Browse Products
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse border rounded-lg p-4">
                        <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                        <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-neutral-600 mb-4">
                      Start shopping to see your orders here.
                    </p>
                    <Link href="/shop">
                      <Button className="bg-black text-white hover:bg-neutral-800">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">Order #{order.orderNumber}</h3>
                            <p className="text-sm text-neutral-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <p className="text-sm font-medium mt-1">${order.total}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          {order.trackingNumber && (
                            <Button variant="outline" size="sm">
                              Track Package
                            </Button>
                          )}
                          {order.status === 'delivered' && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download Invoice
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Designs Tab */}
          <TabsContent value="designs" className="mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Custom Designs</CardTitle>
                  <Link href="/design">
                    <Button className="bg-black text-white hover:bg-neutral-800">
                      Create New Design
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {designsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-neutral-200 aspect-square rounded-lg mb-3"></div>
                        <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                        <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : customDesigns.length === 0 ? (
                  <div className="text-center py-8">
                    <Palette className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No designs yet</h3>
                    <p className="text-neutral-600 mb-4">
                      Create your first custom design to see it here.
                    </p>
                    <Link href="/design">
                      <Button className="bg-black text-white hover:bg-neutral-800">
                        Start Designing
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customDesigns.map((design: any) => (
                      <Card key={design.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-neutral-100 rounded-lg mb-3 overflow-hidden">
                            {design.previewUrl ? (
                              <img
                                src={design.previewUrl}
                                alt={design.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Palette className="h-8 w-8 text-neutral-400" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-medium mb-1">{design.name}</h3>
                          <p className="text-sm text-neutral-600 mb-2">
                            {design.productType} • {design.color} • {design.size}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">${design.price}</span>
                            <div className="flex space-x-1">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="outline" size="sm">
                                Duplicate
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order Updates</p>
                      <p className="text-sm text-neutral-600">Get notified about order status changes</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-neutral-600">Receive news and promotional offers</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">WhatsApp Notifications</p>
                      <p className="text-sm text-neutral-600">Get updates via WhatsApp</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Security</h3>
                    <Button variant="outline" className="w-full mb-2">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full">
                      Two-Factor Authentication
                    </Button>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Data & Privacy</h3>
                    <Button variant="outline" className="w-full mb-2">
                      Download My Data
                    </Button>
                    <Button variant="outline" className="w-full mb-2">
                      Privacy Settings
                    </Button>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Account Management</h3>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.location.href = "/api/logout"}
                    >
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
