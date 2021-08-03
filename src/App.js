import { useState } from "react";
import './App.css';
import CarouselTrack from './Components/CarouselTrack';
import CarouselControls from "./Components/CarouselControls";

const carouselItems = [
  {
    title: "First Item",
    image: "https://via.placeholder.com/150/000",
    description: "This would be the first item."
  },
  {
    title: "Second Item",
    image: "https://via.placeholder.com/150/666",
    description: "Leading to the second item."
  },
  {
    title: "Third Item",
    image: "https://via.placeholder.com/150/ccc",
    description: "Culminating in a third, wonderful item."
  }
];

function App() {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const onCarouselIndexChange = (index) => {
    setCarouselIndex(index);
  }

  const settings = {
    index: carouselIndex,
    visibleItems: 1,
    numItems: carouselItems.length,
    infiniteMode: true,
    transitionTime: 500,
    disableOnTransition: false,
    onIndexChange: onCarouselIndexChange
  }

  return (
    <div className="App">
      <CarouselTrack {...settings}>
        {
          carouselItems.map((e, c) => (
            <div key={`carousel-item-${c}`}>
              <h1>{e.title}</h1>
              <img src={e.image} alt={e.description} />
            </div>
          ))
        }
      </CarouselTrack>
      <CarouselControls {...settings}></CarouselControls>
    </div>
  );
}

export default App;
