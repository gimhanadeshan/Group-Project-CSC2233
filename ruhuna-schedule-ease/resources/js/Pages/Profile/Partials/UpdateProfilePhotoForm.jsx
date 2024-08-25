import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { FiEdit, FiX } from 'react-icons/fi';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '/resources/js/utils/cropImage.js';

export default function UpdateProfilePhotoForm({ user, className }) {
    const { data, setData, post, processing, errors, delete: destroy } = useForm({
        profile_img: null,
        croppedArea: null
    });

    const [preview, setPreview] = useState(user.profile_img ? '/profile_photos/' + user.profile_img : '/profile_photos/default-profile-image.png');
    const [showOptions, setShowOptions] = useState(false);
    const [showCropBox, setShowCropBox] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [fileError, setFileError] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        
        if (file) {
            if (!file.type.startsWith('image/')) {
                setFileError('Please select a valid image file.');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setFileError('File size should not exceed 5MB.');
                return;
            }
            
            setFileError('');
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setShowCropBox(true);  // Show crop box
            };
            reader.readAsDataURL(file);
            setData('profile_img', file);
        }
    };

    const handleCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleSaveCrop = async () => {
        try {
            if (!croppedAreaPixels) {
                throw new Error('No cropped area defined');
            }
    
            const croppedImage = await getCroppedImg(preview, croppedAreaPixels);
            const croppedFile = new File([croppedImage], data.profile_img.name, { type: 'image/jpeg' });
    
            setData('profile_img', croppedFile);
            setPreview(URL.createObjectURL(croppedFile));
    
            alert('Profile picture cropped and saved successfully!');
        } catch (error) {
            console.error('Error cropping image:', error);
            alert('An error occurred while cropping the image.');
        } finally {
            // Always close the crop box
            setShowCropBox(false);
        }
    };
    
    
    

    const handleCloseCropBox = () => {
        setShowCropBox(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        post(route('profile.updatePhoto'), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onSuccess: () => {
                setData('profile_img', null);
                alert('Profile photo updated successfully!');
            },
            onError: () => {
                alert('An error occurred while updating the profile photo.');
            },
        });
    };

    const handleDelete = (event) => {
        event.preventDefault(); // Prevents default behavior if necessary
        console.log('Delete Photo clicked');
        // Add your delete logic here
    };
    

    return (
        <div className={className}>
            <h4 className="font-semibold text-xl text-gray-800 leading-tight">Profile Photo</h4>

            <div className="relative flex justify-center mt-5">
                <img
                    className="w-60 h-60 rounded-full object-cover shadow-lg ring-4 ring-white"
                    src={preview}
                    alt="userPhoto"
                />
            <button
    className="relative bg-white text-black rounded-full flex items-center justify-center border border-gray-300"
    onClick={() => setShowOptions(!showOptions)}
    title="Edit Photo"
    style={{ 
        zIndex: 10, 
        transform: 'translate(-90%, 450%)', // Center the button
        height: '40px',// Adjust the height to your desired value
        padding: '8px 15px',

        
    }}
>
    <FiEdit size={15} className="mr-2" /> {/* Pencil icon with margin */}
    <span className="text-black font-medium">Edit</span> {/* Text next to icon */}
</button>



{showOptions && (
    <div className="absolute top-full mt-2 bg-white shadow-md rounded-md p-2">
        <button
            className="text-gray-800 mb-2 block w-full text-left"
            onClick={() => {
                document.getElementById('fileInput').click();
                setShowOptions(false); // Close the options tab after selecting Update Photo
            }}
        >
            Update Photo
        </button>
        <button
            className="text-gray-800 block w-full text-left"
            onClick={(event) => {
                // Log to ensure handleDelete is called
                //console.log('Delete Photo clicked');
                handleDelete();
                setShowOptions(false); // Close the options tab after selecting Delete Photo
            }}
        >
            Delete Photo
        </button>
    </div>
)}

            </div>

            {fileError && <div className="text-red-600 text-sm mt-2">{fileError}</div>}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input
                    type="file"
                    name="profile_img"
                    id="fileInput"
                    onChange={handleFileChange}
                    className="hidden"
                />

{showCropBox && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="relative bg-white p-4 rounded-lg shadow-lg" 
             style={{ 
                 width: '80vw',   // Adjust the window size here
                 height: '80vw',  // Adjust the window size here
                 maxWidth: '400px', // Set max size to maintain responsiveness
                 maxHeight: '400px' // Set max size to maintain responsiveness
             }}>
            <h3 className="text-xl font-semibold mb-4 text-center">Crop your new profile picture</h3>
            <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                onZoomChange={setZoom}
                style={{
                    containerStyle: {
                        width: '100%', // Full width of the crop window
                        height: '100%', // Full height of the crop window
                    },
                    cropAreaStyle: {
                        border: '2px solid #000',
                        borderRadius: '50%',
                    }
                }}
            />
            <PrimaryButton
                onClick={handleSaveCrop}
                className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300"
>
             Crop and Save
        </PrimaryButton>

            <button
                className="absolute top-2 right-2 p-2 bg-gray-800 text-white rounded-full"
                onClick={handleCloseCropBox}
                title="Close"
            >
                <FiX size={24} />
            </button>
        </div>
    </div>
)}


                {processing && <div className="text-blue-600 text-sm mt-2">Processing...</div>}
            </form>
        </div>
    );
}
