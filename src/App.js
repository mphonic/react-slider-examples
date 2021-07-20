import { useState } from "react";
import './App.css';
import CarouselTrack from './Components/CarouselTrack';
import CarouselControls from "./Components/CarouselControls";

function App() {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const onCarouselIndexChange = (index) => {
    setCarouselIndex(index);
  }

  const settings = {
    index: carouselIndex,
    visibleItems: 1,
    transitionTime: 500,
    onIndexChange: onCarouselIndexChange
  }

  return (
    <div className="App">
      <CarouselTrack {...settings}>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </CarouselTrack>
      <CarouselControls {...settings}></CarouselControls>
    </div>
  );
}

export default App;
