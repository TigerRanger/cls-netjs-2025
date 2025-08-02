"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFilterItems } from "@/redux/filterSlice"; // Adjust the path as needed
import filterSvg from "../../../public/svg-icon/filter-black.svg";
import Image from "next/image";
import OffCanvasFilter from "@/components/ProductPage/OffCanvasFilter";

import { CustomFilter, Aggregation, FilterList } from "@/lib/Interface/FilterInterface";

interface FilterInterface {
  filters: Aggregation[] | null;
  setActivefilters: (filters: FilterList[]) => void;
  triggerUserAction: () => void;
  setMaxMin: (max:number , min:number) => void;
  activeFilters:FilterList[];
  filter_data: CustomFilter | null;
  NZMaxPrice: number;
  NZMinPrice: number;
}

const ProductFilter: React.FC<FilterInterface> = ({ filters =null , setActivefilters , triggerUserAction , setMaxMin , activeFilters , filter_data,
  NZMaxPrice , NZMinPrice

 }) => {

  const [isOpen, setOpen] = useState<boolean>(false);
    const dispatch = useDispatch();

    const [isAssign, setisAssign] = useState<boolean>(true);

  useEffect(() => {

      if (!isAssign) return ;
      setisAssign(false);

    if (filters?.length) {
      const filterList = filters.map((filter) => ({
        attribute_code: filter?.attribute_code,
        position: filter.position ? filter.position.toString() : null,
        options: filter.options.map((option) => ({
          ...option,
          active: option.active ?? false, // Ensure 'active' is a boolean
        })),
        count: filter.count,
        label: filter.label,
        value: null, // Add the missing 'value' property
      }));
      dispatch(setFilterItems(filterList));
    }
  }, [ dispatch, filters, isAssign]); // Only runs when `filters` changes

  const toggleFilter = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <div className="filter_box" onClick={toggleFilter}>
        <Image src={filterSvg} width={30} alt="list_mode" /> <span>Filter</span>
      </div>
        <OffCanvasFilter isOpen={isOpen} onClose={toggleFilter} setActivefilters={setActivefilters}
            triggerUserAction= {triggerUserAction} setMaxMin={setMaxMin} activeFilters={activeFilters}
            filter_data={filter_data}
            NZMaxPrice = {NZMaxPrice}
            NZMinPrice = {NZMinPrice}

      />
    </>
  );
};

export default ProductFilter;