import { useState } from "react";
import FormInput from "./form/FormInput";
import FormSelect from "./form/FormSelect";
import FormRadioGroup from "./form/FormRadioGroup";
import FormFileUpload from "./form/FormFileUpload";
import SubmitButton from "./form/SubmitButton";
import { toast } from "@/hooks/use-toast";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const provinceOptions = [
  { value: "central", label: "Central Province" },
  { value: "copperbelt", label: "Copperbelt Province" },
  { value: "eastern", label: "Eastern Province" },
  { value: "luapula", label: "Luapula Province" },
  { value: "lusaka", label: "Lusaka Province" },
  { value: "muchinga", label: "Muchinga Province" },
  { value: "northern", label: "Northern Province" },
  { value: "northwestern", label: "North-Western Province" },
  { value: "southern", label: "Southern Province" },
  { value: "western", label: "Western Province" },
];

const constituencyOptions: Record<string, { value: string; label: string }[]> = {
  lusaka: [
    { value: "chawama", label: "Chawama" },
    { value: "kabwata", label: "Kabwata" },
    { value: "kanyama", label: "Kanyama" },
    { value: "lusaka_central", label: "Lusaka Central" },
    { value: "mandevu", label: "Mandevu" },
    { value: "matero", label: "Matero" },
    { value: "munali", label: "Munali" },
  ],
  copperbelt: [
    { value: "chililabombwe", label: "Chililabombwe" },
    { value: "chingola", label: "Chingola" },
    { value: "kalulushi", label: "Kalulushi" },
    { value: "kitwe_central", label: "Kitwe Central" },
    { value: "luanshya", label: "Luanshya" },
    { value: "mufulira", label: "Mufulira" },
    { value: "ndola_central", label: "Ndola Central" },
  ],
  central: [
    { value: "kabwe_central", label: "Kabwe Central" },
    { value: "kapiri_mposhi", label: "Kapiri Mposhi" },
    { value: "mkushi", label: "Mkushi" },
    { value: "mumbwa", label: "Mumbwa" },
    { value: "serenje", label: "Serenje" },
  ],
  eastern: [
    { value: "chipata_central", label: "Chipata Central" },
    { value: "petauke", label: "Petauke" },
    { value: "katete", label: "Katete" },
    { value: "lundazi", label: "Lundazi" },
  ],
  luapula: [
    { value: "mansa_central", label: "Mansa Central" },
    { value: "samfya", label: "Samfya" },
    { value: "kawambwa", label: "Kawambwa" },
  ],
  muchinga: [
    { value: "chinsali", label: "Chinsali" },
    { value: "mpika", label: "Mpika" },
    { value: "nakonde", label: "Nakonde" },
  ],
  northern: [
    { value: "kasama_central", label: "Kasama Central" },
    { value: "mbala", label: "Mbala" },
    { value: "luwingu", label: "Luwingu" },
  ],
  northwestern: [
    { value: "solwezi_central", label: "Solwezi Central" },
    { value: "kasempa", label: "Kasempa" },
    { value: "mufumbwe", label: "Mufumbwe" },
  ],
  southern: [
    { value: "livingstone", label: "Livingstone" },
    { value: "choma_central", label: "Choma Central" },
    { value: "mazabuka", label: "Mazabuka" },
    { value: "monze", label: "Monze" },
  ],
  western: [
    { value: "mongu_central", label: "Mongu Central" },
    { value: "senanga", label: "Senanga" },
    { value: "sesheke", label: "Sesheke" },
  ],
};

const RegistrationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    gender: "",
    province: "",
    constituency: "",
    ward: "",
    isRegisteredVoter: "",
    voterCardNumber: "",
    phoneNumber: "",
    profilePhoto: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset constituency when province changes
      ...(field === "province" && { constituency: "" }),
    }));

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (parseInt(formData.age) < 18 || parseInt(formData.age) > 120) {
      newErrors.age = "Age must be between 18 and 120";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }

    if (!formData.province) {
      newErrors.province = "Please select your province";
    }

    if (!formData.constituency) {
      newErrors.constituency = "Please select your constituency";
    }

    if (!formData.isRegisteredVoter) {
      newErrors.isRegisteredVoter = "Please indicate if you are registered to vote";
    }

      // Only require voter card number when user says they are a registered voter
      if (formData.isRegisteredVoter === "yes") {
        if (!formData.voterCardNumber) {
          newErrors.voterCardNumber = "Voter's card number is required when registered";
        } else if (!/^\d{6,12}$/.test(formData.voterCardNumber)) {
          // allow between 6 and 12 digits for flexibility
          newErrors.voterCardNumber = "Voter's card number must be 6-12 digits";
        }
      }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else {
      // accept +country, spaces, dashes, parentheses; validate 7-15 digits
      const digits = formData.phoneNumber.replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15) {
        newErrors.phoneNumber = "Please enter a valid phone number (7-15 digits)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let res;
      if (formData.profilePhoto) {
        const fd = new FormData();
        fd.append('name', formData.fullName);
        fd.append('email', formData.email);
        fd.append('phone', formData.phoneNumber);
        fd.append('age', formData.age);
        fd.append('gender', formData.gender);
        fd.append('province', formData.province);
        fd.append('constituency', formData.constituency);
        fd.append('ward', formData.ward);
        fd.append('isRegisteredVoter', formData.isRegisteredVoter);
        fd.append('voterCardNumber', formData.voterCardNumber);
        fd.append('profilePhoto', formData.profilePhoto as File);

        res = await fetch("http://localhost:4000/api/register", {
          method: "POST",
          body: fd,
        });
      } else {
        const payload = {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phoneNumber,
          age: formData.age,
          gender: formData.gender,
          province: formData.province,
          constituency: formData.constituency,
          ward: formData.ward,
          isRegisteredVoter: formData.isRegisteredVoter,
          voterCardNumber: formData.voterCardNumber,
        };
        res = await fetch("http://localhost:4000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        const data = await res.json();
        toast({
          title: "Registration Successful!",
          description: `Member registered (id: ${data.id}).`,
        });
        // reset form (keep province/constituency choices cleared)
        setFormData({
          fullName: "",
          email: "",
          age: "",
          gender: "",
          province: "",
          constituency: "",
          ward: "",
          isRegisteredVoter: "",
          voterCardNumber: "",
          phoneNumber: "",
          profilePhoto: null,
        });
      } else {
        const err = await res.json().catch(() => ({}));
        if (res.status === 409) {
          toast({ title: "Duplicate", description: err.error || "Email already exists", variant: "destructive" });
        } else if (res.status === 400) {
          toast({ title: "Invalid", description: err.error || "Bad request", variant: "destructive" });
        } else {
          toast({ title: "Error", description: err.error || "Registration failed", variant: "destructive" });
        }
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Network Error", description: "Could not reach the server.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const availableConstituencies = formData.province
    ? constituencyOptions[formData.province] || []
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormInput
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={(e) => handleChange("fullName", e.target.value)}
        required
        error={errors.fullName}
      />

      <FormInput
        label="Email"
        type="email"
        placeholder="Enter your email address"
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
        required
        error={errors.email}
      />

      <FormInput
        label="Age"
        type="number"
        placeholder="Enter your age"
        min={18}
        max={120}
        value={formData.age}
        onChange={(e) => handleChange("age", e.target.value)}
        required
        error={errors.age}
      />

      <FormSelect
        label="Gender"
        options={genderOptions}
        placeholder="Select your gender"
        value={formData.gender}
        onChange={(e) => handleChange("gender", e.target.value)}
        required
        error={errors.gender}
      />

      <FormSelect
        label="Province"
        options={provinceOptions}
        placeholder="Select your province"
        value={formData.province}
        onChange={(e) => handleChange("province", e.target.value)}
        required
        error={errors.province}
      />

      <FormSelect
        label="Constituency"
        options={availableConstituencies}
        placeholder={
          formData.province
            ? "Select your constituency"
            : "Select a province first"
        }
        value={formData.constituency}
        onChange={(e) => handleChange("constituency", e.target.value)}
        disabled={!formData.province}
        required
        error={errors.constituency}
      />

      <FormInput
        label="Ward"
        type="text"
        placeholder="Enter your ward (optional)"
        value={formData.ward}
        onChange={(e) => handleChange("ward", e.target.value)}
      />

      <FormRadioGroup
        label="Are you registered to vote?"
        name="isRegisteredVoter"
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
        value={formData.isRegisteredVoter}
        onChange={(value) => handleChange("isRegisteredVoter", value)}
        required
        error={errors.isRegisteredVoter}
      />

      <FormInput
        label="Voter's Card Number"
        type="text"
        placeholder="Enter 6-12 digit voter's card number"
        maxLength={12}
        value={formData.voterCardNumber}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "").slice(0, 12);
          handleChange("voterCardNumber", value);
        }}
        required
        error={errors.voterCardNumber}
      />

      <FormInput
        label="Phone Number"
        type="tel"
        placeholder="Enter your phone number"
        value={formData.phoneNumber}
        onChange={(e) => handleChange("phoneNumber", e.target.value)}
        required
        error={errors.phoneNumber}
      />

      <FormFileUpload
        label="Profile Photo"
        onChange={(file) => handleChange("profilePhoto", file)}
        accept="image/*"
        helperText="Images will be automatically compressed. Any size accepted."
        error={errors.profilePhoto}
      />

      <div className="pt-4">
        <SubmitButton isLoading={isLoading}>
          REGISTER MEMBER
        </SubmitButton>
      </div>
    </form>
  );
};

export default RegistrationForm;
