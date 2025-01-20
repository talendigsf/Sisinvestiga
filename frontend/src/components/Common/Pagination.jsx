import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../../css/Common/Pagination.css";

const Pagination = ({ currentPage, totalPages, onNext, onPrev, disabledPrev, disabledNext }) => {
  return (
    <div className="pagination-controls">
      <button
        onClick={onPrev}
        disabled={disabledPrev}
        className="pagination-btn"
      >
        <FaArrowLeft /> Anterior
      </button>

      <span>
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={disabledNext}
        className="pagination-btn"
      >
        Siguiente <FaArrowRight />
      </button>
    </div>
  );
};

export default Pagination;
