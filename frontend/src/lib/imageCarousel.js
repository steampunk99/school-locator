import React from 'react'
import { Card, CardContent } from "../components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"



export default function ImageCarousel({ images = [] }) {
  return (
    <Carousel className="w-auto h-auto " plugins={[Autoplay({ delay: 3000, }),  ]}>
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardContent className="flex  items-center justify-center p-0">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="rounded-lg object-cover w-full h-full"
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  )
}