import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false
}: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-between items-center bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-4 border border-blue-100 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
                <ChevronLeftIcon className="w-4 h-4" />
                Previous
            </button>

            <span className="text-gray-700 font-medium">
                Page <span className="text-blue-600 font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
                Next
                <ChevronRightIcon className="w-4 h-4" />
            </button>
        </div>
    );
}
