import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Plus, Trash2, ImagePlus } from 'lucide-react';

const AddMovie = () => {
  // Part 1 States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [movieType, setMovieType] = useState('Normal');
  const [durationHours, setDurationHours] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [rating, setRating] = useState('');
  const [standardPrice, setStandardPrice] = useState('');
  const [reclinerPrice, setReclinerPrice] = useState('');
  const [auditorium, setAuditorium] = useState('Audi 1');
  const [story, setStory] = useState('');

  // Part 2 States (Files & Dynamic Arrays)
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [castData, setCastData] = useState([{ name: '', role: '', file: null, preview: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Handlers ---
  const handleMovieTypeChange = (e) => setMovieType(e.target.value);

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleAddCast = () => {
    setCastData([...castData, { name: '', role: '', file: null, preview: '' }]);
  };

  const handleRemoveCast = (index) => {
    const newCast = [...castData];
    newCast.splice(index, 1);
    setCastData(newCast);
  };

  const handleCastChange = (index, field, value) => {
    const newCast = [...castData];
    newCast[index][field] = value;
    setCastData(newCast);
  };

  const handleCastFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newCast = [...castData];
      newCast[index].file = file;
      newCast[index].preview = URL.createObjectURL(file);
      setCastData(newCast);
    }
  };

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!posterFile) {
      return toast.error('Please upload a movie poster.');
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append standard text fields
      formData.append('title', title);
      formData.append('category', category);
      formData.append('movieType', movieType);
      
      // Calculate total duration in minutes
      const totalDuration = (parseInt(durationHours) || 0) * 60 + (parseInt(durationMinutes) || 0);
      formData.append('duration', totalDuration);
      
      formData.append('rating', rating);
      formData.append('auditorium', auditorium);
      formData.append('story', story);

      // Stringify Objects
      formData.append(
        'seatPrices',
        JSON.stringify({
          standard: parseInt(standardPrice) || 150,
          recliner: parseInt(reclinerPrice) || 250,
        })
      );

      // Append Poster File
      formData.append('poster', posterFile);

      // Process and append Cast data
      // Filter out empty cast entries
      const validCast = castData.filter(c => c.name.trim() !== '');
      
      const castTextData = validCast.map((c) => ({
        name: c.name,
        role: c.role,
      }));
      formData.append('cast', JSON.stringify(castTextData));

      validCast.forEach((c) => {
        if (c.file) {
          formData.append('castImages', c.file);
        }
      });

      // Get JWT Token (assuming it might be stored directly or inside a userInfo object)
      let token = localStorage.getItem('token');
      if (!token) {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) token = JSON.parse(userInfo).token;
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post('http://localhost:5000/api/movies', formData, config);

      toast.success('Movie added successfully!');
      
      // Optional: Reset form here
      setTimeout(() => window.location.reload(), 1500);

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add movie. Check console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UI Tailwind Classes ---
  const inputClasses =
    'w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 mt-1 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200';
  const labelClasses = 'block text-sm font-medium text-gray-300';

  return (
    <div className="p-8 text-white min-h-screen bg-slate-950">
      <ToastContainer theme="dark" position="top-right" />
      
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-red-500 tracking-wider">Add New Movie</h1>

        <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-xl shadow-lg border border-slate-800">
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Left Column (Poster Upload) */}
            <div className="col-span-1 border-r border-slate-800 pr-0 xl:pr-8">
              <label className={`${labelClasses} mb-4 text-lg font-semibold text-white`}>Movie Poster</label>
              <div className="relative w-full aspect-[2/3] rounded-xl border-2 border-dashed border-slate-700 bg-slate-800 flex flex-col items-center justify-center overflow-hidden group hover:border-red-500 transition-colors cursor-pointer">
                {posterPreview ? (
                  <img src={posterPreview} alt="Poster Output" className="object-cover w-full h-full" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 group-hover:text-red-500 transition-colors">
                    <ImagePlus size={48} className="mb-2" />
                    <span className="text-sm">Click to upload poster</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Right Column (Movie Details) */}
            <div className="col-span-1 xl:col-span-2">
              
              {/* Movie Type Radio Buttons */}
              <label className={`${labelClasses} mb-3 text-lg font-semibold text-white`}>Movie Type</label>
              <div className="flex flex-wrap gap-6 mb-8 bg-slate-800 p-4 rounded-lg">
                {['Normal', 'Featured', 'Releases Soon', 'Latest Trailer'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="movieType"
                      value={type}
                      checked={movieType === type}
                      onChange={handleMovieTypeChange}
                      className="w-4 h-4 text-red-600 bg-slate-900 border-slate-700 focus:ring-red-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="text-gray-300 group-hover:text-white transition-colors">{type}</span>
                  </label>
                ))}
              </div>

              {/* Standard Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="title" className={labelClasses}>Movie Title</label>
                  <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} placeholder="e.g. Inception" required />
                </div>
                <div>
                  <label htmlFor="category" className={labelClasses}>Category / Genre</label>
                  <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClasses} placeholder="e.g. Action, Sci-Fi" required />
                </div>
                <div>
                  <label htmlFor="rating" className={labelClasses}>Rating</label>
                  <input type="number" id="rating" step="0.1" min="0" max="10" value={rating} onChange={(e) => setRating(e.target.value)} className={inputClasses} placeholder="e.g. 8.8" />
                </div>
              </div>

              {/* Story */}
              <div className="mb-6">
                <label htmlFor="story" className={labelClasses}>Storyline / Plot</label>
                <textarea id="story" rows="3" value={story} onChange={(e) => setStory(e.target.value)} className={`${inputClasses} resize-none`} placeholder="Brief description of the movie..." required></textarea>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className={labelClasses}>Duration</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="number" placeholder="Hrs" value={durationHours} onChange={(e) => setDurationHours(e.target.value)} className={`${inputClasses} mt-0`} min="0" />
                    <span className="text-gray-400">:</span>
                    <input type="number" placeholder="Mins" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} className={`${inputClasses} mt-0`} min="0" max="59" />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Seat Prices</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="number" placeholder="Std ($)" value={standardPrice} onChange={(e) => setStandardPrice(e.target.value)} className={`${inputClasses} mt-0`} min="0" />
                    <input type="number" placeholder="Rec ($)" value={reclinerPrice} onChange={(e) => setReclinerPrice(e.target.value)} className={`${inputClasses} mt-0`} min="0" />
                  </div>
                </div>

                <div>
                  <label htmlFor="auditorium" className={labelClasses}>Auditorium</label>
                  <select id="auditorium" value={auditorium} onChange={(e) => setAuditorium(e.target.value)} className={`${inputClasses} appearance-none cursor-pointer`}>
                    <option value="Audi 1">Audi 1</option>
                    <option value="Audi 2">Audi 2</option>
                    <option value="Audi 3">Audi 3</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-800 my-8" />

          {/* Cast Details Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <label className="text-xl font-semibold text-white">Cast Details</label>
              <button
                type="button"
                onClick={handleAddCast}
                className="flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                <Plus size={16} /> Add Cast Member
              </button>
            </div>
            
            <div className="space-y-6">
              {castData.map((cast, index) => (
                <div key={index} className="flex flex-col md:flex-row items-start gap-4 p-4 bg-slate-800/50 rounded-lg relative">
                  
                  {/* Cast Image Wrapper */}
                  <div className="w-24 h-24 shrink-0 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-red-500 transition-colors">
                    {cast.preview ? (
                      <img src={cast.preview} alt="Cast preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlus size={24} className="text-slate-500 group-hover:text-red-500" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCastFileChange(index, e)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  {/* Cast Inputs */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Actor Name</label>
                      <input
                        type="text"
                        value={cast.name}
                        onChange={(e) => handleCastChange(index, 'name', e.target.value)}
                        className={inputClasses}
                        placeholder="e.g. Leonardo DiCaprio"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Role Type (Actor/Director)</label>
                      <input
                        type="text"
                        value={cast.role}
                        onChange={(e) => handleCastChange(index, 'role', e.target.value)}
                        className={inputClasses}
                        placeholder="e.g. Actor"
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  {castData.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCast(index)}
                      className="mt-6 md:mt-2 p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove Cast Member"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-slate-800 w-full">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-10 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Publishing Movie...' : 'Publish Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;
