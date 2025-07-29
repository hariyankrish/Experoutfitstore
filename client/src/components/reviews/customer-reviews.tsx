import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  author: string;
  verified: boolean;
  createdAt: string;
}

export default function CustomerReviews() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Mock reviews - in a real app, this would fetch from an API
  const reviews: Review[] = [
    {
      id: '1',
      rating: 5,
      title: "Amazing quality!",
      comment: "Amazing quality and the design tool is so easy to use! My custom hoodie turned out exactly how I imagined.",
      author: "Sarah M.",
      verified: true,
      createdAt: "2024-01-15T10:00:00Z"
    },
    {
      id: '2',
      rating: 5,
      title: "Great service",
      comment: "Fast shipping and great customer service. The WhatsApp support made ordering so convenient!",
      author: "Mike D.",
      verified: true,
      createdAt: "2024-01-12T14:30:00Z"
    },
    {
      id: '3',
      rating: 5,
      title: "Perfect fit",
      comment: "Love the streetwear aesthetic and the custom options. Finally found a brand that gets my style!",
      author: "Alex R.",
      verified: true,
      createdAt: "2024-01-10T09:15:00Z"
    },
    {
      id: '4',
      rating: 4,
      title: "Good quality",
      comment: "Really impressed with the print quality and fabric. The colors are vibrant and haven't faded after multiple washes.",
      author: "Jordan K.",
      verified: true,
      createdAt: "2024-01-08T16:45:00Z"
    },
    {
      id: '5',
      rating: 5,
      title: "Exceeded expectations",
      comment: "The custom design process was so smooth. Love being able to see exactly how it will look before ordering!",
      author: "Taylor S.",
      verified: true,
      createdAt: "2024-01-05T11:20:00Z"
    },
    {
      id: '6',
      rating: 4,
      title: "Great variety",
      comment: "So many options for customization. The AI background removal feature saved me tons of time!",
      author: "Casey L.",
      verified: true,
      createdAt: "2024-01-02T13:10:00Z"
    }
  ];

  const reviewsPerPage = 3;
  const totalSlides = Math.ceil(reviews.length / reviewsPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentReviews = () => {
    const start = currentSlide * reviewsPerPage;
    return reviews.slice(start, start + reviewsPerPage);
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-black mb-4">What Our Customers Say</h3>
          <p className="text-neutral-600 mb-6">Real feedback from our community</p>
          
          {/* Overall Rating */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(averageRating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-neutral-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-neutral-600">({reviews.length} reviews)</span>
          </div>
        </div>
        
        {/* Reviews Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {getCurrentReviews().map((review) => (
              <Card key={review.id} className="bg-neutral-50 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  
                  {/* Review Content */}
                  {review.title && (
                    <h4 className="font-semibold mb-2">{review.title}</h4>
                  )}
                  <p className="text-neutral-700 mb-4 line-clamp-4">{review.comment}</p>
                  
                  {/* Author */}
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-neutral-200 text-neutral-600">
                        {review.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm">{review.author}</span>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-neutral-500 text-xs">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full w-10 h-10 p-0 bg-white shadow-lg hover:shadow-xl"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full w-10 h-10 p-0 bg-white shadow-lg hover:shadow-xl"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Slide Indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            {[...Array(totalSlides)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentSlide ? 'bg-black' : 'bg-neutral-300'
                }`}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-neutral-600 mb-4">Have you tried our products?</p>
          <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
            Write a Review
          </Button>
        </div>
      </div>
    </section>
  );
}
