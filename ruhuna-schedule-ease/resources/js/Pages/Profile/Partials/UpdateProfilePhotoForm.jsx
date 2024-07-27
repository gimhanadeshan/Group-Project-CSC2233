import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import { Transition } from '@headlessui/react';


export default function UpdateProfilePhotoForm({ user, className }) {
    const { data, setData, post, processing, errors ,recentlySuccessful,delete: destroy  } = useForm({
        profile_img: null
    });

    const [preview, setPreview] = useState(user.profile_img ? '/profile_photos/' + user.profile_img : '/profile_photos/default-profile-image.png' );

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        
        console.log(file);

        setData('profile_img', file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        console.log(event.target.files[0].name);

        if (file) {
            reader.readAsDataURL(file);
        } else {
            setPreview('/profile_photos/default-profile-image.png');
        }
        event.target.value = '';
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        post(route('profile.updatePhoto'), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        setData('profile_img', null);
    };

    const handleDelete = (event) => {
        event.preventDefault();
        setPreview('/profile_photos/default-profile-image.png');
        destroy(route('profile.photo.delete'));
        setData('profile_img', null);
        
    };

    return (
        <div className={className}>
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Update Profile Photo</h2>

            <div className="flex justify-center mt-5">
                <label htmlFor='fileInput'>
                <img
                    className="w-24 h-24 rounded-full"
                    src={preview}
                    alt="userPhoto"
                    
                    
                />
                </label>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mt-4">
                    <input
                        type="file"
                        name="profile_img"
                        id='fileInput'
                        placeholder='none'
                        onChange={handleFileChange}
                        //className=" mt-1 block w-full bg-red-400"
                        className="hidden"
                    />
                    
                    {errors.profile_img && <div className="text-red-600 text-sm mt-2">{errors.profile_img}</div> }

                    

                </div>

                <div className="mt-4 flex justify-center gap-7">
                    {/* <button
                        type="submit"
                        className="btn btn-primary "
                        disabled={processing}
                    >
                        
                    </button> */}

                    
                    <PrimaryButton disabled={processing}>{processing ? 'Updating...' : 'Update Photo'}</PrimaryButton>

                   

                    <DangerButton onClick={handleDelete} disabled={processing} >Delete Photo</DangerButton>

                    

                </div>
            </form>
        </div>
    );
}
