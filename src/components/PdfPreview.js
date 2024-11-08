import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

const PdfPreview = ({ fileName, fileUrl }) => {
    const [numPages, setNumPages] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="w-full h-full">
            <h2 className='text-lg mb-4'><a href={fileUrl} target="_blank" rel="noreferrer">{fileName}</a></h2>
            <div className='border-solid border-4 h-full overflow-auto'>
                <Document
                    file={fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page key={`page_${index + 1}`} pageNumber={index + 1} className='' />
                    ))}
                </Document>
            </div>
        </div>
    );
};

export default PdfPreview;
