import React, { useState } from 'react';
import FOIRequestCard from './FOIRequestCard';

function FOIRequestsList({ requests, processingDays }) {
    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 12;

    // Calculate total pages
    const totalPages = Math.ceil(requests.length / requestsPerPage);

    // Get current page requests
    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
    const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="grid lg:grid-cols-3 -mt-10">
                {currentRequests.map((request) => (
                    <React.Fragment key={request.id}>
                        <FOIRequestCard request={request} processingDays={processingDays} />
                    </React.Fragment>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`py-2 px-4 mx-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-gray-500 text-white'}`}
                >
                    Previous
                </button>

                <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`py-2 px-4 mx-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-gray-500 text-white'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default FOIRequestsList;