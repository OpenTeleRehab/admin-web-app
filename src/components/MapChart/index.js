import React, { useState } from 'react';
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from 'react-simple-maps';
import PropTypes from 'prop-types';
import scssColors from 'scss/custom.scss';
import { GEOGRAPHIES } from '../../variables/geographies';
import { Button } from 'react-bootstrap';
import { BsPlus, BsDash } from 'react-icons/bs';

const MapChart = ({ setTooltipContent, countries }) => {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 2 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 2 }));
  };

  const handleMoveEnd = () => {
    setPosition(position);
  };

  return (
    <>
      <ComposableMap data-tip="" height={380} projectionConfig={{ scale: 140 }}>
        <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={handleMoveEnd}>
          <Geographies geography={GEOGRAPHIES.WORD_MAP_110M}>
            {({ geographies }) =>
              geographies.map(geo => {
                const country = countries.find((item) => item.iso_code === geo.properties.ISO_A2);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={country ? scssColors.primary : scssColors.orangeLight}
                    onMouseEnter={() => {
                      const { NAME } = geo.properties;
                      setTooltipContent(NAME);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('');
                    }}
                    style={{
                      default: {
                        outline: 'none'
                      },
                      hover: {
                        stroke: scssColors.primary,
                        strokeWidth: 1,
                        outline: 'none'
                      },
                      pressed: {
                        outline: 'none'
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <div className="d-flex flex-column map-chart-controls">
        <Button size="sm" variant="link" onClick={() => handleZoomIn()} disabled={position.zoom === 4} aria-label="zoom in">
          <BsPlus />
        </Button>
        <Button size="sm" variant="link" onClick={() => handleZoomOut()} disabled={position.zoom === 1} aria-label="zoom out">
          <BsDash />
        </Button>
      </div>
    </>
  );
};

MapChart.propTypes = {
  setTooltipContent: PropTypes.func,
  countries: PropTypes.array
};

export default MapChart;
