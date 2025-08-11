import { useRef, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

function ImageUpload({ onUploadSuccess }) {
  const [imageUrl, setImageUrl] = useState('/default-profile.png'); // default placeholder
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click(); // Click on image opens file dialog
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);

      const response = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      const newImageUrl = response.data.imageUrl;
      setImageUrl(newImageUrl);
      setUploading(false);
      setUploadProgress(0);

      onUploadSuccess(newImageUrl); // Inform parent
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <img
        src={imageUrl}
        alt="Profile"
        onClick={handleImageClick}
        className="w-32 h-32 rounded-full object-cover cursor-pointer border-2 border-gray-300 hover:opacity-80"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      {uploading && (
        <div className="w-32 mt-2">
          <div className="h-2 bg-gray-300 rounded overflow-hidden">
            <div
              className="h-2 bg-blue-500 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="text-xs text-center mt-1 text-gray-600">
            {uploadProgress}%
          </div>
        </div>
      )}
    </div>
  );
}

ImageUpload.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
};

export default ImageUpload;
