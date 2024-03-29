import { useState } from 'react';
import '../styles/main.scss';
import CatalogItem from './CatalogItem';
import categories from '../assets/elements/categories';
import useWindowSize from '../utils/helperFunctions/window.utils';

// TODO (after MVP): make infinite loop carousel (https://dev.to/rakumairu/how-to-handle-infinite-loop-in-react-carousel-43ae)

function Carousel() {
  const screen = useWindowSize();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchPosition, setTouchPosition] = useState(null);
  const length = categories && categories.length;
  let show = length - 1;

  const next = () => {
    if (currentIndex < length - show) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const handleTouchStart = (e) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
  };

  const handleTouchMove = (e) => {
    const touchDown = touchPosition;

    if (touchDown === null) {
      return;
    }

    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;

    if (diff > 5) {
      next();
    }

    if (diff < -5) {
      prev();
    }

    setTouchPosition(null);
  };

  // display 1 carousel item up to small-width screens
  if (screen.width <= 480 && screen.width > 0) {
    show = 1;
  } else if (screen.width <= 768 && screen.width > 481) {
    // display 2 carousel items up to medium-width screens
    show = 2;
  } else {
    show = length - 1;
  }

  return (
    <div className="categories-container">
      <div className="carousel-container">
        <div className="carousel-wrapper">
          {currentIndex > 0 && (
            <button className="left-arrow" onClick={prev}>
              &lt;
            </button>
          )}
          <div
            className="carousel-content-wrapper"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div
              className={`carousel-content show-${show}`}
              style={{
                transform: `translateX(-${currentIndex * (100 / show)}%)`,
              }}
            >
              {categories.map((category) => (
                <CatalogItem key={category.id} category={category} />
              ))}
            </div>
          </div>
          {currentIndex < length - show && (
            <button className="right-arrow" onClick={next}>
              &gt;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carousel;
