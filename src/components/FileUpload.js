import { useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '@/lib/supabase';
import Dropzone from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

export default function FileUpload({ requestId, setIsModalOpen }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select a file to upload.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Generate a unique suffix for the file name
            const timestamp = Date.now();
            const uniqueSuffix = `${timestamp}_${Math.random().toString(36).substring(2, 8)}`;

            // Extract file extension
            const fileExtension = selectedFile.name.split('.').pop();

            // Remove extension from file name
            const fileNameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, '');

            // Append the unique suffix before the extension
            const fileNameWithSuffix = `${fileNameWithoutExtension}_${uniqueSuffix}.${fileExtension}`;

            // Upload the file to Supabase storage
            const { data, error } = await supabase.storage
                .from('foi-requests')
                .upload(`responses/${fileNameWithSuffix}`, selectedFile);

            if (error) {
                // console.log('An error occurred:', error);
                toast.error('Failed to upload file.');
                setIsSubmitting(false);
                return;
            }

            // console.log('File uploaded successfully:', data);
            const fileUrl = data.fullPath;

            // Update the request record with the file URL
            const { error: requestError } = await supabase
                .from('requests')
                .update({ response: fileUrl })
                .eq('id', requestId);

            if (requestError) {
                toast.error('Failed to update request.');
            } else {
                toast.success('File uploaded successfully.');
                setIsModalOpen(false);
            }
        } catch (error) {
            // console.error('An error occurred:', error);
            toast.error('An unexpected error occurred. Please try again later.');
        }

        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md">
                <h2 className="text-xl font-bold mb-4">Upload Response</h2>
                <Dropzone onDrop={(acceptedFiles) => setSelectedFile(acceptedFiles[0])}>
                    {({ getRootProps, getInputProps }) => (
                        <section className="border p-4">
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <p>{selectedFile ? selectedFile.name : "Drag 'n' drop a PDF file here, or click to select one."}</p>
                            </div>
                        </section>
                    )}
                </Dropzone>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleFileUpload}
                        className="bg-primary1 hover:bg-primary2 text-white py-2 px-4 rounded-md"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Uploading...' : 'Upload Response'}
                    </button>
                </div>
            </div>
        </div>
    );
}
