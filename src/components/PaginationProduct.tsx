import React from "react";

import Image from "next/image";

interface PaginationProps {
  pageSize: number;
  Totalitems: number;
  currentPage: number;
  update?: (page: number) => void;
}
const PaginationProduct: React.FC<PaginationProps> = ({ pageSize, Totalitems, currentPage = 1 , update = () => {} }) => {
  const totalPages = Math.ceil(Totalitems / pageSize);
  const maxVisiblePages = 5;
  const generatePagination = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 3);
      const endPage = Math.min(totalPages, currentPage + 3);
      if (startPage > maxVisiblePages) {
        pages.push("...");
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };
  return (
<div className="product-pagination">
  {/* Prev button */}
  <button
    disabled={currentPage === 1}
    onClick={() => {
      if (currentPage > 1) update(currentPage - 1);
    }}
  >
    <Image src="/images/arrow-left.svg" width={20} height={20} alt="Previous" />
  </button>

  {/* Page numbers */}
  {generatePagination().map((page, index) =>
    page === "..." ? (
      <span key={`dots-${index}`} className="dots">...</span>
    ) : (
      <button
        key={`page-${page}`}
        className={currentPage === page ? "active" : ""}
        onClick={() => update(Number(page))}
      >
        {page}
      </button>
    )
  )}

  {/* Next button */}
  <button
    disabled={currentPage === totalPages}
    onClick={() => {
      if (currentPage < totalPages) update(currentPage + 1);
    }}
  >
    <Image src="/images/right-arrow.svg" width={20} height={20} alt="Next" />
  </button>
</div>
  );
};
export default PaginationProduct;