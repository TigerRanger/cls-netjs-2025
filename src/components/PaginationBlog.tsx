import React from "react";
interface PaginationProps {
  pageSize: number;
  Totalitems: number;
  currentPage: number;
  urlextra: string;
}
const PaginationBlog: React.FC<PaginationProps> = ({ pageSize, Totalitems, currentPage = 1 , urlextra="" }) => {
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
    <div className="blog-pagination">
      <button disabled={currentPage === 1}>Prev</button>
      {generatePagination().map((page, index) =>
        page === "..." ? (
          <span key={`dots-${index}`} className="dots">...</span> 
        ) : (
          <button key={`page-${page}`} className={currentPage === page ? "active" : ""}>
              { page === currentPage ? <span>{page}</span> : <a href={`/${urlextra}/${page}`}> {page}</a> }
          </button>
        )
      )}
      <button disabled={currentPage === totalPages}>Next</button>
    </div>
  );
};
export default PaginationBlog;