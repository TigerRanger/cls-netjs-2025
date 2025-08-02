"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateOption } from "@/redux/filterSlice";
import { RootState } from "@/redux/store";
import Image from "next/image";
import CloseWhite from "../../../public/svg-icon/cross-close.svg";
import CLoseBlack from "../../../public/svg-icon/close-black.svg";
import { CustomFilter, FilterList } from "@/lib/Interface/FilterInterface";

interface OffCanvasFilterProps {
  isOpen: boolean;
  onClose: () => void;
  setActivefilters: (filters: FilterList[]) => void;
  triggerUserAction: () => void;
  setMaxMin: (max: number, min: number) => void;
  activeFilters: FilterList[];
  filter_data: CustomFilter | null;
  NZMaxPrice: number;
  NZMinPrice: number;
}

const OffCanvasFilter: React.FC<OffCanvasFilterProps> = ({
  isOpen,
  onClose,
  setActivefilters,
  triggerUserAction,
  setMaxMin,
  activeFilters,
  filter_data,
  NZMaxPrice,
  NZMinPrice
  
}) => {
  const filter_max =
    filter_data && filter_data.maxPrice !== null && filter_data.maxPrice !== undefined
      ? Number(filter_data.maxPrice)
      : null;
  const filter_min =
    filter_data && filter_data.minPrice !== null && filter_data.minPrice !== undefined
      ? Number(filter_data.minPrice)
      : null;

  const dispatch = useDispatch();

const filtersRaw = useSelector((state: RootState) => state.filter.filters);

const filters = useMemo(() => {
  return filtersRaw || [];
}, [filtersRaw]);


  
  const priceFilter = filters.find((filter) => filter.attribute_code === "price");
  const initialMinPrice =  NZMinPrice;
  const initialMaxPrice = NZMaxPrice;


  const [sliderMinValue, setSliderMinValue] = useState(initialMinPrice);
  const [sliderMaxValue, setSliderMaxValue] = useState(initialMaxPrice);
  const [minVal, setMinVal] = useState(initialMinPrice);
  const [maxVal, setMaxVal] = useState(initialMaxPrice);
  const [minInput, setMinInput] = useState(initialMinPrice);
  const [maxInput, setMaxInput] = useState(initialMaxPrice);
  const minGap = 5;

  const [ReadyPrice, setReadyPrice] = useState(true);

  useEffect(() => {
    if (!ReadyPrice) return;
    setReadyPrice(false);

    setSliderMinValue(initialMinPrice);
    setSliderMaxValue(initialMaxPrice);
    setMinVal(initialMinPrice);
    setMaxVal(initialMaxPrice);
    setMinInput(initialMinPrice);
    setMaxInput(initialMaxPrice);

    let min = initialMinPrice;
    let max = initialMaxPrice;

    if (filter_max && filter_max !== 0) {
      setMaxInput(filter_max);
      setMaxVal(filter_max);
      max = filter_max;
    } else {
      setMaxInput(initialMaxPrice);
      setMaxVal(initialMaxPrice);
    }
    if (filter_min && filter_min !== 0) {
      setMinInput(filter_min);
      setMinVal(filter_min);
      min = filter_min;
    } else {
      setMinInput(initialMinPrice);
      setMinVal(initialMinPrice);
    }
    setMaxMin(max, min);
  }, [ReadyPrice, initialMaxPrice, initialMinPrice, filter_max, filter_min, setMaxMin]);

  const slideMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= sliderMinValue && maxVal - value >= minGap) {
      setMinVal(value);
      setMinInput(value);
    }
  };

  const slideMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value <= sliderMaxValue && value - minVal >= minGap) {
      setMaxVal(value);
      setMaxInput(value);
    }
  };

  const handleMinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? sliderMinValue : parseInt(e.target.value, 10);
    if (value >= sliderMinValue && value < maxVal - minGap) {
      setMinInput(value);
      setMinVal(value);
    }
  };

  const handleMaxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? sliderMaxValue : parseInt(e.target.value, 10);
    if (value <= sliderMaxValue && value > minVal + minGap) {
      setMaxInput(value);
      setMaxVal(value);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: "min" | "max") => {
    const value = parseInt(e.currentTarget.value, 10);
    if (e.key === "Enter") {
      if (type === "min" && value >= sliderMinValue && value < maxVal - minGap) {
        setMinVal(value);
      } else if (type === "max" && value <= sliderMaxValue && value > minVal + minGap) {
        setMaxVal(value);
      }
    }
  };

  const handleCheckboxChange = (attribute_code: string, value: string, active: boolean) => {
    dispatch(updateOption({ attribute_code, value, active: !active }));
    triggerUserAction();
  };

  const handleSliderInteractionEnd = () => {
    setMaxMin(maxVal, minVal);
    triggerUserAction();
  };


const activeFiltersDerived = useMemo(() => {
  return filters
    .map((filter) => ({
      ...filter,
      position: filter.position !== null && filter.position !== undefined ? String(filter.position) : null,
      value: filter.value ?? "",
      options: filter.options.filter((option) => option.active),
    }))
    .filter((filter) => filter.options.length > 0);
}, [filters]);



  useEffect(() => {
    setActivefilters(activeFiltersDerived);
  }, [activeFiltersDerived, setActivefilters]);

  function RemoveFromActiveFilter(event: React.MouseEvent<HTMLLIElement, MouseEvent>): void {
    const li = event.currentTarget;
    const filterLabel = li.querySelector("strong")?.textContent;
    const optionLabel = li.querySelector("span")?.textContent;

    const filter = activeFilters.find((f) => f.label === filterLabel);
    if (!filter) return;
    const option = filter.options.find((o) => o.label === optionLabel);
    if (!option) return;

    dispatch(updateOption({ attribute_code: filter.attribute_code, value: option.value, active: false }));
    triggerUserAction();
  }

  const clearactivePrice = () => {
    setSliderMinValue(initialMinPrice);
    setSliderMaxValue(initialMaxPrice);
    setMinVal(initialMinPrice);
    setMaxVal(initialMaxPrice);
    setMinInput(initialMinPrice);
    setMaxInput(initialMaxPrice);
    setMaxMin(initialMaxPrice, initialMinPrice);
    triggerUserAction();
  };

  const [clearTriggeredRef, setclearTriggeredRef] = useState(false);

  function ClearAllActiveFilters(): void {
    if (activeFilters.length > 0) {
      filters.forEach((filter) => {
        filter.options.forEach((option) => {
          if (option.active) {
            dispatch(updateOption({ attribute_code: filter.attribute_code, value: option.value, active: false }));
          }
        });
      });
    }
    if (initialMinPrice !== minVal || initialMaxPrice !== maxVal) {
      setSliderMinValue(initialMinPrice);
      setSliderMaxValue(initialMaxPrice);
      setMinVal(initialMinPrice);
      setMaxVal(initialMaxPrice);
      setMinInput(initialMinPrice);
      setMaxInput(initialMaxPrice);
      setclearTriggeredRef(true);
    } else {
      triggerUserAction();
    }
  }

  useEffect(() => {
    if (!clearTriggeredRef) return;
    setMaxMin(initialMaxPrice, initialMinPrice);
    setclearTriggeredRef(false);
    triggerUserAction();
  }, [initialMaxPrice, initialMinPrice, setMaxMin, triggerUserAction, clearTriggeredRef]);

  return (
    <>
      <div className={`overlay ${isOpen ? "open" : ""}`} onClick={onClose} />
      <div className={`offCanvasFilter ${isOpen ? "open" : ""}`}>
        <button className="closeButton" onClick={onClose}>
          <Image src={CloseWhite} width={17} height={17} alt="close" />
        </button>

        <h2>Filters</h2>

        {(activeFilters.length > 0 || initialMinPrice !== minVal || initialMaxPrice !== maxVal) && (
          <div className="active_filter_box">
            <h3>Now Shopping by</h3>
            <ul>
              {(initialMaxPrice !== maxVal || initialMinPrice !== minVal) && (
                <li className="active-filter" onClick={clearactivePrice}>
                  <Image src={CLoseBlack} width={20} height={20} alt="close" />
                  <strong>Price</strong>
                  <span>
                    {minVal} - {maxVal}
                  </span>
                </li>
              )}

              {activeFilters.map((activefilter) =>
                activefilter.options.map((option) => (
                  <li key={option.value} className="active-filter" onClick={RemoveFromActiveFilter}>
                    <Image src={CLoseBlack} width={20} height={20} alt="close" />
                    <strong dangerouslySetInnerHTML={{ __html: activefilter.label }} />
                    <span dangerouslySetInnerHTML={{ __html: option.label }} />
                  </li>
                ))
              )}
            </ul>
            <button className="clear_all_filter" onClick={ClearAllActiveFilters}>
              Clear All
            </button>
          </div>
        )}

        <div className="filter-list">
          {priceFilter && (
            <div className="filter-group">
              <h3>{priceFilter.label}</h3>

              <div className="double-slider-box">
                <div className="input-box">
                  <div className="min-box">
                    <input
                      type="number"
                      value={minInput}
                      onChange={handleMinInput}
                      onKeyDown={(e) => handleInputKeyDown(e, "min")}
                      className="min-input"
                      min={sliderMinValue}
                      max={maxVal - minGap}
                    />
                  </div>
                  <div className="max-box">
                    <input
                      type="number"
                      value={maxInput}
                      onChange={handleMaxInput}
                      onKeyDown={(e) => handleInputKeyDown(e, "max")}
                      className="max-input"
                      min={minVal + minGap}
                      max={sliderMaxValue}
                    />
                  </div>
                </div>
                <div className="range-slider">
                  <div className="slider-track"></div>
                  <input
                    type="range"
                    min={sliderMinValue}
                    max={sliderMaxValue}
                    value={minVal}
                    onChange={slideMin}
                    className="min-val"
                    onMouseUp={handleSliderInteractionEnd}
                    onTouchEnd={handleSliderInteractionEnd}
                  />
                  <input
                    type="range"
                    min={sliderMinValue}
                    max={sliderMaxValue}
                    value={maxVal}
                    onChange={slideMax}
                    className="max-val"
                    onMouseUp={handleSliderInteractionEnd}
                    onTouchEnd={handleSliderInteractionEnd}
                  />
                </div>
              </div>
            </div>
          )}

          {filters
            .filter((filter) => filter.attribute_code !== "price")
            .map((filter) => (
              <div key={filter.attribute_code} className="filter-group">
                <h3>{filter.label}</h3>
                <div className="filter-content">
                  {filter.options.map((option) => (
                    <label key={option.value} className="filter-option">
                      <input
                        type="checkbox"
                        checked={option.active}
                        onChange={() =>
                          handleCheckboxChange(filter.attribute_code, option.value, option.active)
                        }
                      />
                      <span dangerouslySetInnerHTML={{ __html: option.label }} /> ({option.count})
                    </label>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default OffCanvasFilter;
