import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"; // This is the firebase provider for google sign in
import { app } from "../firebase";
import {useDispatch} from 'react-redux'
import {signInSuccess} from '../redux/user/userSlice'
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
   const res = await fetch("/api/auth/google", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       name: result.user.displayName,
       email: result.user.email,
       photo: result.user.photoURL 
     }
       ),
   });
    const data = await res.json();
    dispatch(signInSuccess(data));
    navigate('/');

    } catch (error) {
      console.log("Could not sign in with google", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white p-3 rounded lg uppercase hover:opacity-95 cursor-pointer"
    >
      continue with google
    </button> // The type of the button is button because we don't want it to submit as it is inside the form in signin and signup pages
  );
}
