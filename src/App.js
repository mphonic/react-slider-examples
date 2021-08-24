import { useState } from "react";
import './App.css';
import CarouselTrack from './Components/CarouselTrack';
import CarouselControls from "./Components/CarouselControls";
import CarouselPages from "./Components/CarouselPages";

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
  const [carouselItemIndex, setCarouselItemIndex] = useState(0);

  const onCarouselIndexChange = (index, itemIndex) => {
    setCarouselIndex(index);
    setCarouselItemIndex(itemIndex);
  }

  const onCarouselItemIndexChange = (index) => {
    setCarouselItemIndex(index);
  }

  const settings = {
    index: carouselIndex,
    itemIndex: carouselItemIndex,
    visibleItems: 2,
    numItems: carouselItems.length,
    infiniteMode: true,
    transitionTime: 500,
    disableOnTransition: false,
    onIndexChange: onCarouselIndexChange,
    onItemIndexChange: onCarouselItemIndexChange
  }

  return (
    <div className="App">
      <p>{carouselItems[carouselItemIndex].description}</p>
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
      <CarouselPages {...settings}></CarouselPages>
      <CarouselPages {...settings}>
        {
          carouselItems.map((e, c) => <img key={e.image} src={e.image} alt={e.title} />)
        }
      </CarouselPages>
    </div>
  );
}

export default App;
