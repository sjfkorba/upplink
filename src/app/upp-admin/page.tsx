"use client";
import { useState, useEffect, useRef } from "react";
import { 
  collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, updateDoc 
} from "firebase/firestore";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/config";
import { 
  Car, Building2, ImageIcon, Phone, MapPin, Star, Trash2, Edit3, Loader2,
  Plus, Search, Crown, Zap, Globe, Target, Shield, Calendar, Camera, 
  HardHat, Stethoscope, Hotel, GraduationCap, Bed, Shirt, Users
} from "lucide-react";

const SELLING_FIELDS = [
  { name: "listingTitle", label: "Car Title*", type: "text", required: true, placeholder: "2023 Toyota Fortuner" },
  { name: "make", label: "Brand*", type: "text", required: true, placeholder: "Toyota" },
  { name: "model", label: "Model*", type: "text", required: true, placeholder: "Fortuner" },
  { name: "year", label: "Year*", type: "number", required: true, placeholder: "2023" },
  { name: "kmDriven", label: "KM Driven*", type: "text", required: true, placeholder: "25,500 km" },
  { name: "fuelType", label: "Fuel Type*", type: "select", required: true, options: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"] },
  { name: "transmission", label: "Transmission*", type: "select", required: true, options: ["Manual", "Automatic"] },
  { name: "ownerType", label: "Owner*", type: "select", required: true, options: ["1st", "2nd", "3rd", "4th & Above"] },
  { name: "price", label: "Price (₹)*", type: "text", required: true, placeholder: "35,00,000" },
  { name: "location", label: "City*", type: "text", required: true, placeholder: "Korba, Chhattisgarh" },
  { name: "contact", label: "WhatsApp*", type: "tel", required: true, placeholder: "+91 99999 99999" }
];

const BUSINESS_FIELDS = [
  { name: "businessName", label: "Business Name*", type: "text", required: true, placeholder: "SPR Motors Car Service" },
  { name: "serviceCategory", label: "Category*", type: "select", required: true, options: [
    "taxi-services", "car-service", "auto-dealer", "two-wheeler-service", "car-wash", "tyre-shop",
    "electronic-shop", "medical-store", "jewellery-shop", "furniture-shop", 
    "restaurant", "hotel", "cake-shop", "salon-spa", "hospital", "doctors", 
    "solar-panel", "event-manager", "laundry-service", "photo-studio", 
    "civil-contractor", "electrician", "wedding-planning", "education", 
    "pg-hostels", "real-estate"
  ]},
  { name: "address", label: "Full Address*", type: "textarea", required: true, placeholder: "Railway Station Rd, Korba, CG" },
  { name: "servicesOffered", label: "Services*", type: "textarea", required: true, placeholder: "Car AC repair, denting painting..." },
  { name: "location", label: "City*", type: "text", required: true, placeholder: "Korba, Chhattisgarh" },
  { name: "contact", label: "WhatsApp*", type: "tel", required: true, placeholder: "+91 99999 99999" }
];

const CATEGORY_NAMES: Record<string, string> = {
  "solar-panel": "Solar Panel", "event-manager": "Event Manager", 
  "laundry-service": "Laundry Service", "photo-studio": "Photo Studio",
  "civil-contractor": "Civil Contractor", "electrician": "Electrician",
  "doctors": "Doctors", "hotel": "Hotel", "wedding-planning": "Wedding Planning",
  "education": "Education", "pg-hostels": "PG/Hostels"
};

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
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        alert(`Minimum ${MIN_IMAGES} images required for cars!`);
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
        alert("Listing updated successfully!");
      } else {
        await addDoc(collection(db, "listings"), formObject);
        alert("New listing published!");
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
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchListings = async () => {
    try {
      const snapshot = await getDocs(collection(db, "listings"));
      let listingsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Listing));
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        listingsData = listingsData.filter(listing =>
          (listing.listingTitle || listing.businessName || '').toLowerCase().includes(query) ||
          (listing.location || '').toLowerCase().includes(query) ||
          (listing.serviceCategory || '').toLowerCase().includes(query)
        );
      }
      
      setListings(listingsData);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setEditMode(true);
    setCategory((listing.type as "selling" | "business") || "selling");
    setImagesPreview([]);
    setSelectedImages([]);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this listing?")) {
      await deleteDoc(doc(db, "listings", id));
      fetchListings();
    }
  };

  // 🔥 SEO INDEXING BUTTON FUNCTION
  const handleSEOIndex = () => {
    if (confirm("🚀 Push all listings to Google Index?\n\nThis will log all URLs to console for SEO batch indexing.")) {
      const urls = listings.map(listing => `https://upplink.vercel.app/${listing.slug}`);
      console.log("🔥 SEO BATCH INDEXING:", urls);
      console.log("📱 Copy these URLs to Google Search Console → URL Inspection → Request Indexing");
      alert(`✅ SEO Indexing started!\n${urls.length} URLs logged to console.\n\nCopy from console → Google Search Console → Bulk Index!`);
    }
  };

  const getCategoryDisplayName = (serviceCategory?: string) => {
    if (!serviceCategory) return "Business";
    return CATEGORY_NAMES[serviceCategory] || 
           serviceCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const DynamicField = ({ field }: { field: typeof SELLING_FIELDS[0] }) => (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 block">
        {field.label}
      </label>
      {field.type === "select" ? (
        <select 
          name={field.name} 
          required={field.required}
          defaultValue={editingListing?.[field.name as keyof Listing] || ''}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select {field.label}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {field.name === "serviceCategory" ? getCategoryDisplayName(opt) : opt}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea 
          name={field.name} 
          required={field.required}
          defaultValue={editingListing?.[field.name as keyof Listing] || ''}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
        />
      ) : (
        <input 
          type={field.type} 
          name={field.name} 
          required={field.required}
          defaultValue={editingListing?.[field.name as keyof Listing] || ''}
          placeholder={field.placeholder}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full mb-6">
            <Shield className="w-5 h-5" />
            <span className="font-semibold text-lg">UPP-LINK Admin</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Classified Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage cars & business listings easily
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10 border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex-1">
                {editMode ? "Edit Listing" : "Add New Listing"}
              </h2>
              {editMode && (
                <button 
                  onClick={() => {setEditMode(false); setEditingListing(null);}} 
                  className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Category Toggle */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => setCategory("selling")}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  category === 'selling' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-md'
                }`}
              >
                <Car className="w-6 h-6 mx-auto mb-2" />
                Cars
              </button>
              <button 
                onClick={() => setCategory("business")}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  category === 'business' 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-md'
                }`}
              >
                <Building2 className="w-6 h-6 mx-auto mb-2" />
                Business
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Photos ({MIN_IMAGES}-{MAX_IMAGES})
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()} 
                  className="h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all"
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
                    <Plus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="font-semibold text-gray-700">Click to add photos</p>
                    <p className="text-sm text-gray-500">{imagesPreview.length}/{MAX_IMAGES}</p>
                  </div>
                </div>

                {imagesPreview.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4 p-4 bg-gray-50 rounded-xl max-h-48 overflow-y-auto">
                    {imagesPreview.map(({preview}, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview} 
                          className="w-full h-20 object-cover rounded-lg group-hover:scale-105 transition-transform" 
                          alt=""
                        />
                        <button 
                          onClick={() => removeImage(index)} 
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all" 
                      style={{width: `${uploadProgress}%`}}
                    />
                  </div>
                )}
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentFields.map((field) => (
                  <DynamicField key={field.name} field={field} />
                ))}
              </div>

              {/* Premium */}
              <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <input 
                  type="checkbox" 
                  name="isPremium" 
                  id="isPremium"
                  defaultChecked={editingListing?.isPremium} 
                  className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"
                />
                <label htmlFor="isPremium" className="ml-3 text-sm font-semibold text-gray-900">
                  Premium Listing (Top ranking + featured)
                </label>
              </div>

              <button 
                type="submit" 
                disabled={loading || (category === "selling" && imagesPreview.length < MIN_IMAGES)}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Listing"
                )}
              </button>
            </form>
          </div>

          {/* Listings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-200 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Live Listings ({listings.length})</h2>
              
              {/* 🔥 SEO INDEXING BUTTON BACK! */}
              <button 
                onClick={handleSEOIndex}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm"
              >
                <Zap className="w-4 h-4" />
                SEO Index All
              </button>

              <div className="relative flex-1 min-w-[200px] sm:min-w-[250px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    fetchListings();
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {listings.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No listings yet</p>
                <p className="text-sm">Create your first listing above</p>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div key={listing.id} className="p-6 border border-gray-200 rounded-xl hover:shadow-md hover:border-gray-300 transition-all group">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={listing.images?.[0]} 
                          className="w-24 h-24 lg:w-28 lg:h-28 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform" 
                          alt=""
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.jpg';
                          }}
                        />
                        {listing.isPremium && (
                          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            PREMIUM
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xl text-gray-900 mb-1 truncate">
                          {listing.listingTitle || listing.businessName}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">{listing.location}</p>
                        {listing.price && (
                          <p className="text-2xl font-bold text-green-600 mb-3">₹{listing.price}</p>
                        )}
                        {listing.serviceCategory && (
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {getCategoryDisplayName(listing.serviceCategory)}
                          </span>
                        )}
                        
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <p className="text-xs font-mono text-blue-800 mb-1">Live URL</p>
                          <a 
                            href={`https://upplink.vercel.app/${listing.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold truncate hover:underline"
                          >
                            /{listing.slug}
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-2 lg:mt-0 lg:ml-auto">
                        <a 
                          href={`https://upplink.vercel.app/${listing.slug}`} 
                          target="_blank"
                          className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 hover:scale-105 transition-all"
                          title="View Live"
                        >
                          <Search className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => handleEdit(listing)}
                          className="p-3 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 hover:scale-105 transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(listing.id!)}
                          className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:scale-105 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
