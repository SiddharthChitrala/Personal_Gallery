import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ImageUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [images, setImages] = useState([]);
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/images/${userId}`);
                console.log('Images:', response.data.images);
                setImages(response.data.images || []);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        if (userId) {
            fetchImages(); // Fetch images associated with the user
        }
    }, [userId]); // Include userId in the dependency array


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('userId', userId); // Sending user ID along with the file

            try {
                const response = await axios.post('http://localhost:9000/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Upload successful:', response.data);
                fetchImages(); // Refresh the images after upload
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const fetchImages = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/images/${userId}`);
            console.log('Images:', response.data.images);
            setImages(response.data.images || []);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const deleteImage = async (filename) => {
        try {
            const response = await axios.delete(`http://localhost:9000/image/${filename}/${userId}`);
            console.log('Delete response:', response.data);
            fetchImages(); // Refresh images after deletion
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    return (
        <div className="container mt-5">
            <input className="form-control mb-3" type="file" onChange={handleFileChange} />
            <button className='btn btn-primary' onClick={handleUpload}>Upload</button>

            <div>
                <h2 className="mt-4">Uploaded Images:</h2>
                <ul className="list-unstyled d-flex flex-wrap">
                    {images.map((image, index) => (
                        <li key={index} className="m-3 position-relative">
                            <img
                                src={`http://localhost:9000/img/${image}`}
                                alt=""
                                className="img-thumbnail"
                                style={{ height: '200px' }}
                            />
                            <button
                                className='btn btn-danger position-absolute top-0 end-0 m-2'
                                onClick={() => deleteImage(image)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}

export default ImageUpload;
