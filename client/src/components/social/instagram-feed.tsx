import { Button } from "@/components/ui/button";
import { ExternalLink, Instagram } from "lucide-react";

export default function InstagramFeed() {
  const instagramPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      caption: "Customer wearing custom design",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      caption: "Styled clothing flat lay",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      caption: "Street style photo",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      caption: "Design process behind the scenes",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      caption: "Friends wearing coordinated designs",
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      caption: "Custom embroidery details",
    },
  ];

  const handlePostClick = (postId: number) => {
    // In a real app, this would open the Instagram post
    console.log(`Opening Instagram post ${postId}`);
  };

  const handleFollowClick = () => {
    // In a real app, this would open the Instagram profile
    window.open('https://instagram.com/experoutfit', '_blank');
  };

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Instagram className="h-8 w-8 text-pink-500" />
            <h3 className="text-3xl font-bold text-black">Follow @experoutfit</h3>
          </div>
          <p className="text-neutral-600 mb-6">See how our community styles their custom designs</p>
          <Button 
            onClick={handleFollowClick}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
          >
            <Instagram className="h-4 w-4 mr-2" />
            Follow Us
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post) => (
            <div 
              key={post.id} 
              className="aspect-square bg-neutral-100 rounded-lg overflow-hidden cursor-pointer group relative"
              onClick={() => handlePostClick(post.id)}
            >
              <img 
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-neutral-600 text-sm">
            Share your EXPEROUTFIT designs with{" "}
            <span className="font-semibold text-blue-500">#experoutfit</span> to be featured!
          </p>
        </div>
      </div>
    </section>
  );
}
