import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Camera, User } from 'lucide-react';

// 🔧 Format date (e.g., Jan 2024)
const formatJoinDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
};

const ProfilePage = () => {
    const { updateProfile, authUser, isUpdatingProfile, checkAuth } = useAuthStore();
    const [selectedImage, setSelectedImage] = useState(null);

    const navigate = useNavigate();


    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImage(base64Image);
            await updateProfile({ profilePic: base64Image });
        };
    };

    useEffect(() => {
        checkAuth();
    }, []);


    if (!authUser) return <p className='text-center mt-8'>Loading profile...</p>;


    return (
        <div className='min-h-screen pt-20'>
            <div className='max-w-2xl mx-auto p-4 py-8'>
                <div className='bg-base-300 rounded-xl p-6 space-y-8'>
                    <div className='text-center '>
                        <h1 className='text-2xl font-semibold'>Profile</h1>
                        <p className='mt-2'>Your profile information</p>
                    </div>

                    {/* Avatar Section */}
                    <div className='flex flex-col items-center gap-4'>
                        <div className='relative'>
                            <img
                                src={selectedImage || authUser.profilePic || "/avatar.png"}
                                alt='profile'
                                className='size-32 rounded-full object-cover border-4'
                            />
                            <label
                                htmlFor='avatar-upload'
                                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
                            >
                                <Camera className='w-5 h-5 text-base-200' />
                                <input
                                    type='file'
                                    id='avatar-upload'
                                    className='hidden'
                                    accept='image/*'
                                    onChange={handleImageUpload}
                                    disabled={isUpdatingProfile}
                                />
                            </label>
                        </div>
                        <p className='text-sm text-zinc-400'>
                            {isUpdatingProfile ? "Uploading" : "Click the camera icon to update your profile photo"}
                        </p>
                    </div>

                    {/* User Info */}
                    <div className='space-y-6'>
                        <div className='space-y-1.5'>
                            <div className='text-sm text-zinc-400 flex items-center gap-2'>
                                <User className='w-4 h-4' />
                                Full Name
                            </div>
                            <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser?.fullName}</p>
                        </div>

                        <div className='space-y-1.5'>
                            <div className='text-sm text-zinc-400 flex items-center gap-2'>
                                <User className='w-4 h-4' />
                                Email Address
                            </div>
                            <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser?.email}</p>
                        </div>
                    </div>

                    {/* Other Info */}
                    <div className='mt-6 bg-base-300 rounded-lg p-6'>
                        <h2 className='text-lg font-medium mb-4'>Account Information</h2>
                        <div className='space-y-3 text-sm'>
                            <div className='flex items-center justify-between py-2 border-b border-zinc-700'>
                                <span>Member Since</span>
                                <span>{formatJoinDate(authUser.createdAt)}</span>
                            </div>
                            <div className='flex items-center justify-between py-2'>
                                <span>Account Status</span>
                                <span className='text-green-500'>Active</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
