import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

const AdmPagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  const maxPageNumbersToShow = 20;
  let startPage, endPage;

  if (totalPages <= maxPageNumbersToShow) {
    startPage = 1;
    endPage = totalPages;
  } else {
    const middlePage = Math.floor(maxPageNumbersToShow / 2);
    if (currentPage <= middlePage + 1) {
      startPage = 1;
      endPage = maxPageNumbersToShow;
    } else if (currentPage + middlePage >= totalPages) {
      startPage = totalPages - maxPageNumbersToShow + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - middlePage;
      endPage = currentPage + middlePage;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <BootstrapPagination className="justify-content-center mt-4">
      <BootstrapPagination.First
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      />
      <BootstrapPagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {startPage > 1 && (
        <>
          <BootstrapPagination.Item onClick={() => onPageChange(1)}>1</BootstrapPagination.Item>
          {startPage > 2 && <BootstrapPagination.Ellipsis disabled />}
        </>
      )}
      {pageNumbers.map((number) => (
        <BootstrapPagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => onPageChange(number)}
        >
          {number}
        </BootstrapPagination.Item>
      ))}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <BootstrapPagination.Ellipsis disabled />}
          <BootstrapPagination.Item onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </BootstrapPagination.Item>
        </>
      )}
      <BootstrapPagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
      <BootstrapPagination.Last
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    </BootstrapPagination>
  );
};

export default AdmPagination;
