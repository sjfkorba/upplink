"use client";

import { useState, useEffect, useRef } from "react";
import { 
  collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, updateDoc 
} from "firebase/firestore";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/config";
import { 
  Car, Building2, Image, Phone, MapPin, Star, Trash2, Edit3, Loader2, 
  Upload, X, Plus, Zap, CheckCircle2, Search, Globe, Target, Crown, Shield 
} from "lucide-react";

const SELLING_FIELDS = [
  { name: "listingTitle", label: "🚗 Car Title*", type: "text", required: true, placeholder: "2023 Toyota Fortuner Sigma" },
  { name: "make", label: "Brand*", type: "text", required: true, placeholder: "Toyota" },
  { name: "model", label: "Model*", type: "text", required: true, placeholder: "Fortuner" },
  { name: "year", label: "Year*", type: "number", required: true, placeholder: "2023" },
  { name: "kmDriven", label: "KM Driven*", type: "text", required: true, placeholder: "25,500 km" },
  { name: "fuelType", label: "Fuel Type*", type: "select", required: true, options: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"] },
  { name: "transmission", label: "Transmission*", type: "select", required: true, options: ["Manual", "Automatic"] },
  { name: "ownerType", label: "Owner*", type: "select", required: true, options: ["1st", "2nd", "3rd", "4th & Above"] },
  { name: "price", label: "💰 Price (₹)*", type: "text", required: true, placeholder: "35,00,000" },
  { name: "location", label: "📍 City*", type: "text", required: true, placeholder: "Korba, Chhattisgarh" },
  { name: "contact", label: "📱 WhatsApp*", type: "tel", required: true, placeholder: "+91 99999 99999" }
];

const BUSINESS_FIELDS = [
  { name: "businessName", label: "🏢 Business Name*", type: "text", required: true, placeholder: "SPR Motors Car Service" },
  { name: "serviceCategory", label: "Category*", type: "select", required: true, options: [
    "taxi-services", "car-service", "auto-dealer", "two-wheeler-service", "car-wash", "tyre-shop",
    "electronic-shop", "medical-store", "jewellery-shop", "furniture-shop", 
    "restaurant", "salon-spa", "hospital", "real-estate"
  ]},
  { name: "address", label: "📍 Full Address*", type: "textarea", required: true, placeholder: "Railway Station Rd, Korba, CG" },
  { name: "servicesOffered", label: "Services*", type: "textarea", required: true, placeholder: "Car AC repair, denting painting..." },
  { name: "location", label: "📍 City*", type: "text", required: true, placeholder: "Korba, Chhattisgarh" },
  { name: "contact", label: "📱 WhatsApp*", type: "tel", required: true, placeholder: "+91 99999 99999" }
];

interface Listing {
  id?: string;
  type?: string;
  images?: string[];
  isPremium?: boolean;
  [key: string]: any;
}

export default function AdminPanel() {
  const [category, setCategory] = useState<"selling" | "business">("selling");
  const [loading, setLoading] = useState(false);
  const [imagesPreview, setImagesPreview] = useState<{file: File, preview: string}[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentFields = category === "selling" ? SELLING_FIELDS : BUSINESS_FIELDS;
  const MIN_IMAGES = category === "selling" ? 6 : 1;
  const MAX_IMAGES = category === "selling" ? 20 : 8;
  const LIVE_BASE_URL = "https://upplink.vercel.app";

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
  };

  const removeImage = (index: number) => {
    const newPreviews = imagesPreview.filter((_, i) => i !== index);
    const newFiles = selectedImages.filter((_, i) => i !== index);
    setImagesPreview(newPreviews);
    setSelectedImages(newFiles);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get(category === "selling" ? "listingTitle" : "businessName") as string;
      
      if (category === "selling" && selectedImages.length < MIN_IMAGES) {
        alert(`❌ Minimum ${MIN_IMAGES} images required!`);
        setLoading(false);
        return;
      }

      const slug = generateSlug(title);
      let imageUrls: string[] = [];
      
      if (selectedImages.length > 0) {
        imageUrls = await Promise.all(selectedImages.map(uploadImageToFirebase));
      }

      const formObject: any = {
        type: category,
        images: [...(editingListing?.images || []), ...imageUrls],
        slug,
        isPremium: formData.get("isPremium") === "on",
        createdAt: serverTimestamp(),
        status: "active"
      };

      for (const field of currentFields) {
        const value = formData.get(field.name) as string;
        if (value) formObject[field.name] = value;
      }

      if (editMode && editingListing?.id) {
        await updateDoc(doc(db, "listings", editingListing.id), formObject);
        alert("✅ Listing Updated Successfully!");
      } else {
        await addDoc(collection(db, "listings"), formObject);
        alert("✅ New Listing Published!");
      }

      (e.target as HTMLFormElement).reset();
      setImagesPreview([]);
      setSelectedImages([]);
      setEditMode(false);
      setEditingListing(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchListings();
      setUploadProgress(0);

    } catch (error: any) {
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchListings = async () => {
    try {
      const snapshot = await getDocs(collection(db, "listings"));
      const listingsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Listing));
      setListings(listingsData);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setEditMode(true);
    setCategory((listing.type as "selling" | "business") || "selling");
    setImagesPreview(listing.images?.map(url => ({file: new File([], ''), preview: url})) || []);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this listing?")) {
      await deleteDoc(doc(db, "listings", id));
      fetchListings();
    }
  };

  const DynamicField = ({ field }: { field: typeof SELLING_FIELDS[0] }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
        {field.label}
      </label>
      {field.type === "select" ? (
        <select 
          name={field.name} 
          required={field.required}
          defaultValue={editingListing?.[field.name as keyof Listing] || ''}
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-sm font-medium bg-white/80 hover:bg-white transition-all"
        >
          <option value="">{`Select ${field.label}`}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea 
          name={field.name} 
          required={field.required}
          defaultValue={editingListing?.[field.name as keyof Listing] || ''}
          rows={3}
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium bg-white/80 hover:bg-white resize-vertical h-28 text-sm"
        />
      ) : (
        <input 
          type={field.type} 
          name={field.name} 
          required={field.required}
          defaultValue={editingListing?.[field.name as keyof Listing] || ''}
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium h-12 bg-white/80 hover:bg-white text-sm"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:px-8 lg:py-12">
        
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-3xl shadow-2xl mb-6">
            <Shield className="w-6 h-6" />
            <span className="font-bold text-xl uppercase tracking-wide">UPP-LINK Admin</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
            Classified Manager
          </h1>
          <p className="text-gray-600 font-medium mt-3 text-lg max-w-2xl mx-auto">
            OLX | JustDial | IndiaMart Style • SEO Optimized Listings
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Create/Edit Form */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {editMode ? "✏️ Edit Listing" : "➕ Add New Listing"}
              </h2>
              {editMode && (
                <button 
                  onClick={() => {setEditMode(false); setEditingListing(null);}} 
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all text-sm"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Category Toggle */}
            <div className="flex bg-gradient-to-r from-orange-50 to-emerald-50 border-2 border-gray-100 rounded-2xl p-1 mb-8">
              <button 
                onClick={() => setCategory("selling")}
                className={`flex-1 p-4 rounded-xl font-semibold uppercase tracking-wide text-sm transition-all ${
                  category === 'selling' 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
                }`}
              >
                <Car className="w-5 h-5 inline mr-2" /> Cars
              </button>
              <button 
                onClick={() => setCategory("business")}
                className={`flex-1 p-4 rounded-xl font-semibold uppercase tracking-wide text-sm transition-all ${
                  category === 'business' 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Building2 className="w-5 h-5 inline mr-2" /> Business
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Photos ({MIN_IMAGES}-{MAX_IMAGES})
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()} 
                  className="h-32 border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gradient-to-br from-gray-50 to-white rounded-2xl cursor-pointer flex items-center justify-center group hover:shadow-md transition-all"
                >
                  <input 
                    ref={fileInputRef} 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleImagesUpload} 
                    className="hidden" 
                  />
                  <div className="text-center">
                    <Plus className="w-8 h-8 mx-auto mb-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <p className="font-semibold text-gray-700 group-hover:text-blue-600">Click to Add Photos</p>
                    <p className="text-xs text-gray-500 mt-1">{imagesPreview.length}/{MAX_IMAGES}</p>
                  </div>
                </div>

                {imagesPreview.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4 max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-xl">
                    {imagesPreview.map(({preview}, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview} 
                          className="w-full h-20 object-cover rounded-lg group-hover:scale-105 transition-transform" 
                          alt={`Preview ${index + 1}`}
                        />
                        <button 
                          onClick={() => removeImage(index)} 
                          className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {uploadProgress > 0 && (
                  <div className="mt-3 bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all" 
                      style={{width: `${uploadProgress}%`}}
                    />
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentFields.map((field) => (
                  <DynamicField key={field.name} field={field} />
                ))}
              </div>

              {/* Premium Toggle */}
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-100 rounded-2xl">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center shadow-md">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-900">Premium Listing</p>
                      <p className="text-sm text-yellow-700 font-medium">Top ranking + featured</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    name="isPremium" 
                    defaultChecked={editingListing?.isPremium} 
                    className="w-6 h-6 rounded-lg accent-yellow-500 bg-gray-100 border-2 border-gray-300 focus:ring-yellow-500 transition-all"
                  />
                </label>
              </div>

              <button 
                type="submit" 
                disabled={loading || (category === "selling" && imagesPreview.length < MIN_IMAGES)}
                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-4 rounded-2xl font-bold uppercase tracking-wide text-lg shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "🚀 Publish Listing"
                )}
              </button>
            </form>
          </div>

          {/* Listings Management */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8 max-h-[85vh] overflow-y-auto hover:shadow-2xl transition-all">
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm pt-2 pb-4 border-b border-gray-100 z-10">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-blue-600" />
                Live Listings ({listings.length})
              </h2>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <button 
                  onClick={() => {
                    if (confirm("Push all URLs to Google Index?")) {
                      alert("SEO Batch indexing started! Check console.");
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                >
                  <Zap className="w-4 h-4" />
                  SEO Power Index
                </button>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {listings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No listings yet</p>
                  <p className="text-sm">Create your first listing above</p>
                </div>
              ) : (
                listings.map((listing) => (
                  <div key={listing.id} className="group p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg bg-gradient-to-r from-white to-blue-50/50 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={listing.images?.[0]} 
                          className="w-20 h-20 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform" 
                          alt=""
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                        />
                        {listing.isPremium && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                            PREMIUM
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-lg text-gray-900 truncate leading-tight">
                            {listing.listingTitle || listing.businessName}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 truncate">{listing.location}</p>
                        {listing.price && (
                          <p className="text-xl font-bold text-emerald-600 mb-3">₹{listing.price}</p>
                        )}
                        
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl mb-3">
                          <p className="text-xs font-mono text-blue-800 flex items-center gap-1.5 mb-1">
                            <Globe className="w-3 h-3" />
                            Live URL
                          </p>
                          <a 
                            href={`https://upplink.vercel.app/${listing.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs font-semibold truncate block hover:underline transition-colors"
                            title={listing.slug}
                          >
                            /{listing.slug}
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 ml-auto transition-all">
                        <a 
                          href={`https://upplink.vercel.app/${listing.slug}`} 
                          target="_blank"
                          className="p-2.5 hover:bg-blue-100 rounded-xl hover:scale-105 transition-all"
                          title="View Live"
                        >
                          <Search className="w-4 h-4 text-blue-600" />
                        </a>
                        <button 
                          onClick={() => handleEdit(listing)}
                          className="p-2.5 hover:bg-indigo-100 rounded-xl hover:scale-105 transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4 text-indigo-600" />
                        </button>
                        <button 
                          onClick={() => handleDelete(listing.id!)}
                          className="p-2.5 hover:bg-red-100 rounded-xl hover:scale-105 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
