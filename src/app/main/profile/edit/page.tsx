'use client';
import { Formik, Form, useFormikContext, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import useFormStore from '@/stores/formStore';
import { useRef, useState, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';

const validationSchema = Yup.object({
  // profilePicture: Yup.mixed(),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10, 'Must be at least 10 digits'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  birthDate: Yup.string()
    .required('Birth date is required'),
  github: Yup.string()
    .required('GitHub is required')
    .url('Must be a valid URL')
    .matches(/github\.com/, 'Must be a GitHub URL'),
  gender: Yup.string().required('Gender is required'),
  telegramHandle: Yup.string()
    .required('Telegram handle is required')
    .matches(/^@/, 'Must start with @'),
  graduationYear: Yup.number()
    .required('Graduation year is required')
    .integer('Must be a whole number')
    .min(new Date().getFullYear(), `Year must be at least ${new Date().getFullYear()}`)
    .max(new Date().getFullYear() + 10, `Year must be within 10 years`),
  specialization: Yup.string().required('Specialization is required'),
  department: Yup.string().required('Department is required'),
  mentor: Yup.string().required('Mentor is required'),
  universityId: Yup.string(),
  instagram: Yup.string(),
  linkedin: Yup.string(),
  codeforces: Yup.string(),
  cv: Yup.string(),
  leetcode: Yup.string(),
  joiningDate: Yup.string(),
  bio: Yup.string().max(500, 'Bio must be 500 characters or less'),
  resources: Yup.string()
});

const ProfilePicUpload = () => {
  const { setFieldValue, values, errors, touched } = useFormikContext<any>();
  const { setProfilePicture } = useFormStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setFieldValue('profilePicture', file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (typeof values.profilePicture === 'string') {
      const imgUrl = values.profilePicture.startsWith('http') 
        ? values.profilePicture 
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}${values.profilePicture}`;
      setPreview(imgUrl);
    }
  }, [values.profilePicture]);

  return (
    <div className="col-span-2 mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profile Picture *
      </label>
      <div className="flex items-center gap-4">
        {preview ? (
          <img 
            src={preview} 
            alt="Profile preview" 
            className="w-16 h-16 rounded-full object-cover"
            onError={() => setPreview(null)}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            {values.profilePicture ? 'Change Photo' : 'Upload Photo'}
          </Button>
        </div>
      </div>
      {errors.profilePicture && touched.profilePicture && (
        <p className="mt-1 text-sm text-red-600">{errors.profilePicture.toString()}</p>
      )}
    </div>
  );
};

export default function ProfileEditPage() {
  const { user } = useUserStore();
  const {
    step,
    setStep,
    formData,
    updateFormData,
    resetForm,
  } = useFormStore();

  const initialFormValues = {
    // profilePicture: formData.profilePicture || user?.member?.profilePicture || null,
    firstName: formData.firstName || user?.member?.firstName || '',
    lastName: formData.lastName || user?.member?.lastName || '',
    phoneNumber: formData.phoneNumber || user?.member?.phoneNumber || '',
    email: formData.email || user?.member?.email || '',
    birthDate: formData.birthDate || user?.member?.birthDate || '',
    github: formData.github || user?.member?.github || '',
    gender: formData.gender || user?.member?.gender || '',
    telegramHandle: formData.telegramHandle || user?.member?.telegramHandle || '',
    graduationYear: formData.graduationYear || user?.member?.graduationYear?.toString() || '',
    specialization: formData.specialization || user?.member?.specialization || '',
    department: formData.department || user?.member?.department || '',
    mentor: formData.mentor || user?.member?.mentor || '',
    universityId: formData.universityId || user?.member?.universityId || '',
    cv: formData.cv || user?.member?.cv || '',
    bio: formData.bio || user?.member?.bio || '',
    instagramHandle: formData.instagram || '' || user?.member?.instagramHandle,
    leetcodeHandle : formData.leetcode || '' || user?.member?.leetcodeHandle,
    linkedinHandle: formData.linkedin || '' || user?.member?.linkedinHandle,
    codeforcesHandle: formData.codeforces || '' || user?.member?.codeforcesHandle,
    resources: formData.resources || '' ||user?.member.resource
    // joiningDate : formData.joiningDate|| null ||user?.member?.joiningDate
  };

  useEffect(() => {
    if (user && !formData.firstName) {
      updateFormData(initialFormValues);
    }
  }, [user]);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
  
      const formData = new FormData();
  
      // Append each field individually as form data
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('email', values.email);
      formData.append('birthDate', values.birthDate);
      formData.append('github', values.github);
      formData.append('gender', values.gender);
      formData.append('telegramHandle', values.telegramHandle);
      formData.append('graduationYear', values.graduationYear);
      formData.append('specialization', values.specialization);
      formData.append('department', values.department);
      formData.append('mentor', values.mentor);
      formData.append('universityId', values.universityId || '');
      formData.append('instagramHandle', values.instagramHandle || '');
      formData.append('linkedinHandle', values.linkedinHandle || '');
      formData.append('codeforcesHandle', values.codeforcesHandle || '');
      formData.append('cv', values.cv || '');
      formData.append('leetcodeHandle', values.leetcodeHandle || '');
      formData.append('joiningDate', values.joiningDate || '');
      formData.append('bio', values.bio || '');
  
      // Append profile picture if it exists
      if (values.profilePicture instanceof File) {
        formData.append('profilePicture', values.profilePicture);
      }
  
      // Debug: Log form data entries
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/members/profileDetails`,
        {
          method: "POST",
          body: formData,
          // Don't set Content-Type header - let the browser set it with boundary
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }
  
      const data = await response.json();
      console.log("Success:", data);
      alert("Profile updated successfully!");
      resetForm();
    } catch (error) {
      console.error("Submission failed:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  const validateCurrentStep = async (values: any) => {
    try {
      if (step === 1) {
        await validationSchema.pick([
          'firstName',
          'lastName',
          'phoneNumber',
          'email',
          'birthDate',
          'github',
          'gender',
        ]).validate(values, { abortEarly: false });
      } else if (step === 2) {
        await validationSchema.pick([
          'telegramHandle',
          'graduationYear',
          'specialization',
          'department',
          'mentor',
        ]).validate(values, { abortEarly: false });
      }
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errorMessages = error.inner.map(err => `${err.path}: ${err.message}`).join('\n');
        alert(`Please fix the following errors:\n\n${errorMessages}`);
      }
      return false;
    }
  };

  const handleNext = async (
    values: any,
    { validateForm }: FormikHelpers<any> // Add this
  ) => {
    try {
      if (step === 1) {
        
      }
      setStep(step + 1);
    } catch (error) {
      console.error("Step validation failed:", error);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Update Profile</h1>
      
      <div className="flex mb-6">
        {[1, 2].map((stepNumber) => (
          <Button
            key={stepNumber}
            variant={step === stepNumber ? 'default' : 'ghost'}
            className="mr-2"
            type="button"
            disabled
          >
            {stepNumber === 1 && 'Basic Info'}
            {stepNumber === 2 && 'Additional Info'}
          </Button>
        ))}
      </div>

      <Formik
        initialValues={initialFormValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleChange, errors, touched, isSubmitting, ...formik }) => (
          <Form>
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <h2 className="col-span-2 text-xl font-bold mb-4">Basic Information</h2>
                
                <ProfilePicUpload />
                
                <Input
                  label="First Name *"
                  name="firstName"
                  onChange={handleChange}
                  value={values.firstName}
                  error={touched.firstName && errors.firstName}
                  required
                />
                <Input
                  label="Last Name *"
                  name="lastName"
                  onChange={handleChange}
                  value={values.lastName}
                  error={touched.lastName && errors.lastName}
                  required
                />
                <Input
                  label="Mobile Number *"
                  name="phoneNumber"
                  onChange={handleChange}
                  value={values.phoneNumber}
                  error={touched.phoneNumber && errors.phoneNumber}
                  required
                />
                <Input
                  label="Email Address *"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                  error={touched.email && errors.email}
                  required
                />
                <Input
                  label="Date of Birth *"
                  name="birthDate"
                  onChange={handleChange}
                  value={values.birthDate}
                  error={touched.birthDate && errors.birthDate}
                  required
                />
                <Input
                  label="GitHub *"
                  name="github"
                  onChange={handleChange}
                  value={values.github}
                  error={touched.github && errors.github}
                  required
                />
                <Input
                  label="Gender *"
                  name="gender"
                  onChange={handleChange}
                  value={values.gender}
                  error={touched.gender && errors.gender}
                  required
                />
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                <h2 className="col-span-2 text-xl font-bold mb-4">Additional Information</h2>
                <Input
                  label="Telegram Handle *"
                  name="telegramHandle"
                  onChange={handleChange}
                  value={values.telegramHandle}
                  error={touched.telegramHandle && errors.telegramHandle}
                  required
                />
                <Input
                  label="Expected Graduation Year *"
                  name="graduationYear"
                  type="number"
                  onChange={handleChange}
                  value={values.graduationYear}
                  error={touched.graduationYear && errors.graduationYear}
                  required
                />
                <Input
                  label="Specialization *"
                  name="specialization"
                  onChange={handleChange}
                  value={values.specialization}
                  error={touched.specialization && errors.specialization}
                  required
                />
                <Input
                  label="Department *"
                  name="department"
                  onChange={handleChange}
                  value={values.department}
                  error={touched.department && errors.department}
                  required
                />
                <Input
                  label="Mentor *"
                  name="mentor"
                  onChange={handleChange}
                  value={values.mentor}
                  error={touched.mentor && errors.mentor}
                  required
                />
                <Input
                  label="University ID"
                  name="universityId"
                  onChange={handleChange}
                  value={values.universityId}
                  error={touched.universityId && errors.universityId}
                />
                <Input
                  label="Instagram Handle"
                  name="instagram"
                  onChange={handleChange}
                  value={values.instagram || ''}
                  error={touched.instagram && errors.instagram}
                />
                <Input
                  label="LinkedIn Account"
                  name="linkedin"
                  onChange={handleChange}
                  value={values.linkedin || ''}
                  error={touched.linkedin && errors.linkedin}
                />
                <Input
                  label="Codeforces Handle"
                  name="codeforces"
                  onChange={handleChange}
                  value={values.codeforces||''}
                  error={touched.codeforces && errors.codeforces}
                />
                <Input
                  label="CV URL"
                  name="cv"
                  onChange={handleChange}
                  value={values.cv}
                  error={touched.cv && errors.cv}
                />
                <Input
                  label="Leetcode Handle"
                  name="leetcode"
                  onChange={handleChange}
                  value={values.leetcode||''}
                  error={touched.leetcode && errors.leetcode}
                />
                <Input
                  label="Joining Date"
                  type="date"
                  name="joiningDate"
                  onChange={handleChange}
                  value={values.joiningDate}
                  error={touched.joiningDate && errors.joiningDate}
                />
                <div className="col-span-2">
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Bio
                    </label>
                    <textarea
                      name="bio"
                      onChange={handleChange}
                      value={values.bio}
                      className={`form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        touched.bio && errors.bio ? 'border-red-500' : ''
                      }`}
                      rows={4}
                    />
                    {touched.bio && errors.bio && (
                      <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <div>
                {step > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handlePrevious}
                  >
                    Back
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {step < 2 ? (
                 <Button
                   type="button" // Must be type="button" to avoid form submission
                   onClick={() => handleNext(values, formik)}
                 >
                   Next
                 </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Update
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetForm}
                >
                  Reset Form
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
