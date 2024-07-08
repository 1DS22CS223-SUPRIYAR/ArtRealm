import React, { useState } from 'react';
import axios from 'axios';
import './register.css'; // Import CSS file

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        bio: '',
        userType: '0'
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/register/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
                bio: formData.bio,
                user_type: formData.userType
            });
            if (response.status === 201) {
                setSuccessMessage('User registered successfully');
                setErrorMessage('');
                window.location.href = '/login';
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.error);
                setSuccessMessage('');
            } else {
                setErrorMessage('An error occurred. Please try again.');
                setSuccessMessage('');
            }
        }
    };

    return (
        <div className="register-container w-[300px] h-[100px] ml-[500px]">
            <h2>Register</h2>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className='ml-2'>           
                    <label>Email:</label>
                    <input className='mt-[10px] rounded-md ml-2'type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div>
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Bio:</label>
                    <textarea name="bio"  className="w-[200px] ml-[30px]" value={formData.bio} onChange={handleChange} required />
                </div>
                <div>
                    <label className='-mt-[10px]'>User Type:</label>
                    <select name="userType" value={formData.userType} onChange={handleChange} required>
                        <option value="0">User</option>
                        <option value="1">Artist</option>
                    </select>
                </div>
                <button type="submit" className='-mt-[10px]'>Register</button>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
            </form>
        </div>
    );
};

export default Register;
