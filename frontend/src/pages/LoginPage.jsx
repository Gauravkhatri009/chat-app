import React, { useState } from 'react'
import { Eye, EyeOff, Loader2, Mail, MessageSquare, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import AuthImagepattern from '../components/AuthImagepattern';

const LoginPage = () => {
    const [showPassword, setShowpassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const { login, isLoggingIn } = useAuthStore();
    const validateForm = () => {
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return toast.error("Invalid email")
        if (!formData.password.trim()) return toast.error("Password is required");
        if (formData.password.length < 6) return toast.error("password must be atleast 6 charecter");
        return true;

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        login(formData);

        const success = validateForm();
        // if (success === true) signup(formData);
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* LEFT SIDE OF THE FORM */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className='w-full max-w-md space-y-8'>

                    {/* LOGO START */}
                    <div className='text-center mb-8'>
                        <div className='flex flex-col items-center gap-2 group-[]:'>
                            <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                                <MessageSquare className='size-6 text-primary' />
                            </div>
                            <h1 className='text-2xl font-bold mt-2'>Welcome Back</h1>
                            <p className='text-base-content/60'>Sign in to your account</p>
                        </div>
                    </div>
                    {/* LOGO END */}

                    {/* Form start */}
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='form-control'>

                            <label className='label'>
                                <span className='label-text font-medium'>Email</span>
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Mail className='size-5 text-base-content/40' />
                                </div>
                                <input
                                    type='email'
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder='Email'
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <label className='label'>
                                <span className='label-text font-medium'>Password</span>
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <User className='size-5 text-base-content/40' />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder='........'
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button type='button'
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                    onClick={() => setShowpassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className='size-5 text-base-content/40' />
                                    ) : (
                                        <Eye className='size-5 text-base-content/40' />
                                    )

                                    }

                                </button>
                            </div>


                        </div>

                        {/* Submit Button */}
                        <button type='submit' className='btn btn-primary w-full' disabled={isLoggingIn}>
                            {isLoggingIn ? (
                                <><Loader2 className='size-5 animate-spin' />
                                    Loading...</>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                    {/* Form Ends */}
                    <div className='text-center'>
                        <p className='text-base-content/60'>Already have an Account? {""}
                            <Link to="/login" className='link link-primary'> Sign in </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE OF THE FORM */}
            <div>
                <AuthImagepattern
                    title="Join our community"
                    subTitle="Connect with friends, share moments, and saty in touch with your loved once." />
            </div>


        </div>
    )
}

export default LoginPage
