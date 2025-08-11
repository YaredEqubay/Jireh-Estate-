import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess} from '../redux/user/userSlice.js'
import {useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [profileImage, setProfileImage] = useState(currentUser?.avatar || '/default-profile.jpg');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData]= useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const fileRef = useRef(null);
  const dispatch=useDispatch();

  useEffect(() => {
    if (currentUser?.avatar) {
      setProfileImage(currentUser.avatar);
    }
  }, [currentUser]);

  const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formDataImage = new FormData();
  formDataImage.append('image', file);

  try {
    const res = await axios.post('http://localhost:3000/api/upload', formDataImage, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      },
    });

    const imageUrl = res.data.imageUrl;

    setProfileImage(imageUrl);
    setFormData(prev => ({ ...prev, avatar: imageUrl }));

    setUploadProgress(0);
  } catch (err) {
    console.error('Upload failed:', err);
    setUploadProgress(0);
  }
};


  const handleChange=(e)=>{
  setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    dispatch(updateUserStart());

    const res = await fetch(`/api/user/update/${currentUser._id}`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success === false) {
      dispatch(updateUserFailure(data.message));
      return;
    }

    dispatch(updateUserSuccess(data));
    setUpdateSuccess(true);
  } catch (error) {
    dispatch(updateUserFailure(error.message));
  }
};


  const handleDeleteUser = async () => {
  try {
    dispatch(deleteUserStart());

    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: "DELETE" 
    });

    const data = await res.json();

    if (data.success === false) {
      dispatch(deleteUserFailure(data.message));
      return;
    }

    dispatch(deleteUserSuccess(data));
  } catch (error) {
    dispatch(deleteUserFailure(error.message));
  }
};

const handleSignout = async() => {
 try {
  dispatch(signOutUserStart())
  const res = await fetch(`/api/auth/signout`)
  const data =await res.json();
  if (data.success===false) {
    dispatch(signOutUserFailure(data.message));
    return
  } 
  dispatch(signOutUserSuccess(data));

 } catch (error){
   dispatch(signOutUserFailure(error.message));
  }
};

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-4xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={profileImage}
          alt="Profile"
        />
        {uploadProgress > 0 && (
          <div className="self-center w-3/4 mt-2 text-center text-sm text-gray-600">
            Uploading: {uploadProgress}%
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
        <input
          type="text"
          placeholder="Username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>

        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={'/create-listing'}>
        Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignout}className="text-red-700 cursor-pointer">Sign Out</span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? "Profile updated successfully" : ""}</p>
    </div>
  );
}
