import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: {
    key: string;
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
  showFilters?: boolean;
  onToggleFilters?: () => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
  };
}

export default function SearchFilter({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters = [],
  showFilters = false,
  onToggleFilters,
  onClearFilters,
  hasActiveFilters = false,
  pagination
}: SearchFilterProps) {
  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <motion.div
        className="bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-blue-100"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle Button */}
          {filters.length > 0 && onToggleFilters && (
            <button
              onClick={onToggleFilters}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <FunnelIcon className="h-5 w-5" />
              Filters
              {showFilters ? <XMarkIcon className="h-4 w-4" /> : null}
            </button>
          )}

          {/* Clear Filters Button */}
          {hasActiveFilters && onClearFilters && (
            <button
              onClick={onClearFilters}
              className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filter Options */}
        <AnimatePresence>
          {showFilters && filters.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                {filters.map((filter) => (
                  <div key={filter.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {filter.label}
                    </label>
                    <select
                      value={filter.value}
                      onChange={(e) => filter.onChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">{`All ${filter.label.toLowerCase()}`}</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-2xl p-4 border border-blue-100">
          <button
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1 || pagination.isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Previous
          </button>

          <span className="text-gray-700 font-medium">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages || pagination.isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
