"use client";

import { useState, useEffect, useRef } from "react";
import { 
  collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, updateDoc 
} from "firebase/firestore";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/config";
import { Car, Building2, Image, Phone, MapPin, Star, Trash2, Edit3, Loader2, Upload, X, Plus, Zap, CheckCircle2 } from "lucide-react";

// 🚗 SELLING FIELDS CONFIG (OLX Style - 6+ Images)
const SELLING_FIELDS = [
  { name: "listingTitle", label: "🚗 Car Title", type: "text", required: true, placeholder: "2023 Toyota Fortuner Sigma 4x4" },
  { name: "make", label: "Brand", type: "text", required: true, placeholder: "Toyota" },
  { name: "model", label: "Model", type: "text", required: true, placeholder: "Fortuner" },
  { name: "year", label: "Year", type: "number", required: true, placeholder: "2023" },
  { name: "kmDriven", label: "KM Driven", type: "text", required: true, placeholder: "25,500 km" },
  { name: "fuelType", label: "Fuel Type", type: "select", required: true, options: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"] },
  { name: "transmission", label: "Transmission", type: "select", required: true, options: ["Manual", "Automatic"] },
  { name: "ownerType", label: "Owner", type: "select", required: true, options: ["1st", "2nd", "3rd", "4th & Above"] },
  { name: "price", label: "💰 Price (₹)", type: "text", required: true, placeholder: "35,00,000" },
  { name: "location", label: "📍 City", type: "text", required: true, placeholder: "Korba, Chhattisgarh" },
  { name: "contact", label: "📱 WhatsApp", type: "tel", required: true, placeholder: "+91 99999 99999" }
];

// 🏢 BUSINESS FIELDS CONFIG (Single Image)
const BUSINESS_FIELDS = [
  { name: "businessName", label: "🏢 Business Name", type: "text", required: true, placeholder: "SPR Motors - Premium Car Service" },
  { name: "serviceCategory", label: "Category", type: "select", required: true, options: [
    "Car Service & Repair", "Auto Dealer", "Car Taxi Service", "Two Wheeler Service", 
    "Electronic Shop", "Medical Store", "Jewellery Shop", "Furniture Shop", 
    "Restaurant", "Salon & Spa", "Hospital", "Real Estate"
  ]},
  { name: "address", label: "📍 Full Address", type: "textarea", required: true, placeholder: "Railway Station Rd, Near HDFC Bank, Korba, CG 495677" },
  { name: "servicesOffered", label: "Services Offered", type: "textarea", required: true, placeholder: "Complete car servicing, AC repair, denting-painting..." },
  { name: "location", label: "📍 City", type: "text", required: true, placeholder: "Korba, Chhattisgarh" },
  { name: "contact", label: "📱 WhatsApp", type: "tel", required: true, placeholder: "+91 99999 99999" }
];

interface Listing {
  id?: string;
  type: string;
  images: string[];  // Multiple images array
  isPremium: boolean;
  createdAt: any;
  expiryDate: Date;
  status: string;
  [key: string]: any;
}

export default function AdminPanel() {
  const [category, setCategory] = useState<"selling" | "business">("selling");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagesPreview, setImagesPreview] = useState<{file: File, preview: string}[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // SEO Power Engine States
  const [isIndexing, setIsIndexing] = useState(false);
  const [seoStatus, setSeoStatus] = useState("");

  const currentFields = category === "selling" ? SELLING_FIELDS : BUSINESS_FIELDS;
  const MIN_IMAGES = category === "selling" ? 6 : 1;
  const MAX_IMAGES = category === "selling" ? 20 : 8;

  useEffect(() => {
    fetchListings();
  }, []);

  const uploadImageToFirebase = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const fileName = `listings/${category}/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const storageReference = storageRef(storage, fileName);
    
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageReference, file);
      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / (snapshot.totalBytes || 1)) * 100;
        setUploadProgress(Math.round(progress));
      }, reject, async () => {
        const url = await getDownloadURL(storageReference);
        resolve(url);
      });
    });
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: {file: File, preview: string}[] = [];
    
    for (const file of files) {
      if (file.size < 5 * 1024 * 1024 && !selectedImages.some(f => f.name === file.name)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          validFiles.push({file, preview: e.target?.result as string});
          if (validFiles.length === files.length) {
            setImagesPreview(prev => [...prev, ...validFiles]);
            setSelectedImages(prev => [...prev, ...validFiles.map(v => v.file)]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
    
    if (selectedImages.length + files.length > MAX_IMAGES) {
      alert(`❌ Maximum ${MAX_IMAGES} images allowed!`);
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = imagesPreview.filter((_, i) => i !== index);
    const newFiles = selectedImages.filter((_, i) => i !== index);
    setImagesPreview(newPreviews);
    setSelectedImages(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get(category === "selling" ? "listingTitle" : "businessName") as string;
      
      if (category === "selling" && selectedImages.length < MIN_IMAGES) {
        alert(`❌ Minimum ${MIN_IMAGES} images required for car listing!`);
        setLoading(false); 
        return;
      }

      // Generate Slug
      const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
      
      const expiryDate = new Date();
      if (category === "selling") {
        expiryDate.setDate(expiryDate.getDate() + 30);
      } else {
        expiryDate.setMonth(expiryDate.getMonth() + 6);
      }

      // 1. Upload Images
      const imageUrls: string[] = await Promise.all(
        selectedImages.map(file => uploadImageToFirebase(file))
      );

      const formObject: any = { 
        type: category, 
        images: [...(editingListing?.images || []), ...imageUrls],
        slug, 
        isPremium: formData.get("isPremium") === "on", 
        createdAt: serverTimestamp(), 
        expiryDate, 
        status: "active" 
      };
      
      for (const field of currentFields) {
        const value = formData.get(field.name) as string;
        if (value) formObject[field.name] = value;
      }

      // 2. Save to Firebase
      if (editMode && editingListing?.id) {
        await updateDoc(doc(db, "listings", editingListing.id), formObject);
        alert("✅ Listing Updated Successfully!");
      } else {
        await addDoc(collection(db, "listings"), formObject);
        alert("✅ Listing Published on UPP-LINK!");

        // 🔥🔥🔥 ELITE GOOGLE INDEXING API INTEGRATION
        try {
         const newUrl = `https://upp-link.com/listings/${slug}`;
         
         // Hum apne banaye hue API route ko call kar rahe hain
         const indexResponse = await fetch("/api/index-google", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ url: newUrl }),
         });

         const indexData = await indexResponse.json();
         
         if (indexData.success) {
           console.log("🚀 Google Indexing Request Sent Successfully!");
         } else {
           console.error("⚠️ Indexing API responded with error:", indexData.error);
         }
        } catch (indexError) {
         console.error("❌ Failed to notify Google Indexing API:", indexError);
        }
      }

      // 3. Reset UI
      (e.target as HTMLFormElement).reset();
      setImagesPreview([]);
      setSelectedImages([]);
      setEditMode(false);
      setEditingListing(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchListings();

    } catch (error) {
      alert("❌ Error: " + (error as Error).message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const fetchListings = async () => {
    try {
      const snapshot = await getDocs(collection(db, "listings"));
      setListings(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Listing)));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setEditMode(true);
    setImagesPreview(listing.images.map(url => ({file: new File([], ''), preview: url})));
    setCategory(listing.type as "selling" | "business");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this listing?")) {
      await deleteDoc(doc(db, "listings", id));
      fetchListings();
    }
  };

  // 🔥 SEO Power Engine Function
  const runBatchIndexing = async () => {
    setIsIndexing(true);
    setSeoStatus("Pushing 200 keywords to Google...");
    
    try {
      const res = await fetch("/api/seo-batch", { method: "POST" });
      const data = await res.json();
      setSeoStatus(data.message);
    } catch (error) {
      setSeoStatus("Error running batch.");
    } finally {
      setIsIndexing(false);
    }
  };

  const DynamicField = ({ field }: { field: typeof SELLING_FIELDS[0] }) => (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase text-slate-500 tracking-wide">{field.label}</label>
      {field.type === "select" ? (
        <select name={field.name} required={field.required} className="w-full p-4 bg-white/50 border border-slate-200 rounded-2xl focus:border-indigo-400 h-14 font-semibold">
          <option value="">{`Select ${field.label}`}</option>
          {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : field.type === "textarea" ? (
        <textarea name={field.name} required={field.required} rows={3} 
          className="w-full p-4 bg-white/50 border border-slate-200 rounded-2xl focus:border-indigo-400 font-semibold h-28" />
      ) : (
        <input type={field.type} name={field.name} required={field.required} 
          className="w-full p-4 bg-white/50 border border-slate-200 rounded-2xl focus:border-indigo-400 font-semibold h-14" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-linear-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
            UPP-LINK <span className="text-transparent bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text">Admin Pro</span>
          </h1>
          <p className="text-slate-500 font-bold text-lg mt-2">
            🚗 Cars: Min 6 Images | 🏢 Business: 1-8 Images
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Dynamic Form */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-slate-900">
                {editMode ? "✏️ Edit" : "➕ Create"} {category === "selling" ? "Car" : "Business"}
              </h2>
              {editMode && (
                <button onClick={() => {setEditMode(false); setEditingListing(null);}} 
                  className="px-6 py-2 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600">
                  Cancel
                </button>
              )}
            </div>

            {/* Category Switcher */}
            <div className="flex bg-linear-to-r from-orange-500/10 via-emerald-500/10 p-1 rounded-3xl mb-8">
              <button onClick={() => setCategory("selling")} className={`flex-1 p-4 rounded-2xl font-black uppercase tracking-widest ${
                category === 'selling' ? 'bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-2xl' : 'text-slate-500 hover:bg-orange-50'
              }`}>
                <Car size={22} className="inline mr-2" /> Cars (Min 6 Photos)
              </button>
              <button onClick={() => setCategory("business")} className={`flex-1 p-4 rounded-2xl font-black uppercase tracking-widest ${
                category === 'business' ? 'bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-2xl' : 'text-slate-500 hover:bg-emerald-50'
              }`}>
                <Building2 size={22} className="inline mr-2" /> Business
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 🔥 MULTIPLE IMAGE UPLOAD - CAR SPECIAL */}
              <div className="col-span-2">
                <label className="block text-sm font-bold uppercase text-slate-500 mb-4 tracking-wide items-center gap-2">
                  <Image size={18} />
                  {category === "selling" ? `Photos (${MIN_IMAGES}-${MAX_IMAGES} required)` : "Business Photo"}
                </label>
                
                <div className="space-y-4">
                  {/* Upload Button */}
                  <div onClick={() => fileInputRef.current?.click()} 
                    className="h-32 bg-linear-to-br from-slate-100 to-slate-200 rounded-3xl border-4 border-dashed border-slate-300 hover:border-indigo-400 cursor-pointer flex items-center justify-center group hover:shadow-xl transition-all">
                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImagesUpload} className="hidden" />
                    <div className="text-center">
                      <Plus size={32} className="mx-auto mb-3 text-slate-400 group-hover:text-indigo-500" />
                      <p className="font-bold text-lg">Add {category === 'selling' ? `Photos (${imagesPreview.length}/${MIN_IMAGES} min)` : 'Photo'}</p>
                      <p className="text-sm text-slate-500">{MAX_IMAGES - imagesPreview.length} remaining</p>
                    </div>
                  </div>

                  {/* Image Gallery */}
                  {imagesPreview.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-2 bg-slate-50 rounded-2xl">
                      {imagesPreview.map(({preview}, index) => (
                        <div key={index} className="relative group">
                          <img src={preview} className="w-full h-24 md:h-28 object-cover rounded-xl group-hover:scale-105 transition-transform" />
                          <button 
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {category === "selling" && imagesPreview.length < MIN_IMAGES && (
                    <p className="text-orange-600 font-bold flex items-center gap-2">
                      ⚠️ Need {MIN_IMAGES - imagesPreview.length} more photos for car listing
                    </p>
                  )}
                </div>
              </div>

              {/* Dynamic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentFields.map((field) => (
                  <DynamicField key={field.name} field={field} />
                ))}
              </div>

              {/* Premium Toggle */}
              <div className="p-6 bg-linear-to-r from-yellow-50 to-orange-50 rounded-3xl border-2 border-yellow-100 hover:border-yellow-200 group cursor-pointer">
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-xl text-slate-900 uppercase tracking-tight">Make Premium</p>
                      <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider">⭐ Top Results</p>
                    </div>
                  </div>
                  <input type="checkbox" name="isPremium" className="w-8 h-8 rounded-full accent-yellow-500 shadow-lg" />
                </label>
              </div>

              <button type="submit" disabled={loading || (category === "selling" && imagesPreview.length < MIN_IMAGES)}
                className="w-full bg-linear-to-r from-slate-900 via-indigo-900 to-purple-900 text-white py-8 rounded-3xl font-black uppercase tracking-[0.3em] text-xl shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : "🚀 Launch Listing"}
              </button>
            </form>
          </div>

          {/* Listings Management - Updated for multiple images */}
          <div className="lg:col-span-1 bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border max-h-[80vh] overflow-y-auto space-y-6">
            <h2 className="text-2xl font-black text-slate-900 mb-6 sticky top-0 bg-white/50 backdrop-blur p-4 rounded-xl">
              📋 All Listings ({listings.length})
            </h2>
            
            {/* 🔥 SEO POWER ENGINE - Integrated at the top of management panel */}
            <div className="p-10 bg-slate-900 rounded-[3rem] border border-indigo-500/30 shadow-2xl shadow-indigo-900/20 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                    <Zap className="text-indigo-400" fill="currentColor" size={28} /> SEO Power Engine
                  </h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Daily Google Indexing Limit: 200 URLs
                  </p>
                </div>

                <button 
                  onClick={runBatchIndexing}
                  disabled={isIndexing}
                  className={`px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 transition-all active:scale-95
                    ${isIndexing ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-white hover:text-slate-900 shadow-xl shadow-indigo-500/20'}`}
                >
                  {isIndexing ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                  {isIndexing ? "Indexing Now..." : "Push Batch to Google"}
                </button>
              </div>

              {seoStatus && (
                <div className="mt-6 flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 size={14} /> {seoStatus}
                </div>
              )}
            </div>

            {/* Existing Listings List */}
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="group p-6 rounded-3xl border border-slate-100 hover:shadow-2xl hover:border-indigo-200 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <img src={listing.images?.[0]} className="w-20 h-20 object-cover rounded-2xl shadow-lg" />
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full mt-2 block text-center">
                        {listing.images?.length || 0} pics
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {listing.isPremium && (
                          <span className="px-2 py-1 bg-linear-to-r from-yellow-400 to-orange-400 text-xs font-bold text-white rounded-full uppercase animate-pulse">
                            PREMIUM
                          </span>
                        )}
                        <h4 className="font-black text-lg truncate">{listing.listingTitle || listing.businessName}</h4>
                      </div>
                      <p className="text-sm text-slate-600">{listing.location}</p>
                      {listing.price && <p className="text-xl font-black text-emerald-600 mt-1">₹{listing.price}</p>}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all ml-auto">
                      <button onClick={() => handleEdit(listing)} className="p-2 hover:bg-indigo-100 rounded-xl">
                        <Edit3 size={18} className="text-indigo-600" />
                      </button>
                      <button onClick={() => handleDelete(listing.id!)} className="p-2 hover:bg-red-100 rounded-xl">
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
