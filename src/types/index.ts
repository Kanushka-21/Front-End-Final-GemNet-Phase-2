// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// User Registration Types
export interface UserRegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  nicNumber: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  verificationStatus: string;
  role: 'buyer' | 'seller' | 'admin';
}

// Registration Steps
export enum RegistrationStep {
  PERSONAL_INFO = 1,
  FACE_VERIFICATION = 2,
  NIC_VERIFICATION = 3,
  COMPLETE = 4
}

export interface RegistrationProgress {
  currentStep: RegistrationStep;
  personalInfoCompleted: boolean;
  faceVerificationCompleted: boolean;
  nicVerificationCompleted: boolean;
  userId?: string;
}

// Verification Status
export enum VerificationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REJECTED = 'REJECTED'
}

// Face Verification Types
export interface FaceVerificationResult {
  success: boolean;
  message: string;
  userId?: string;
  confidence?: number;
}

// Enhanced NIC Verification Types with detailed error handling
export interface NicVerificationResult {
  success: boolean;
  message: string;
  data?: {
    userId?: string;
    extractedNicNumber?: string;
    facesMatch?: boolean;
    currentStep?: string;
    stepMessage?: string;
    progress?: number;
    error?: 'POOR_IMAGE_QUALITY' | 'NIC_NUMBER_MISMATCH' | 'FACE_MISMATCH' | 'MISSING_FACE_IMAGE' | 'SYSTEM_ERROR' | 'USER_NOT_FOUND';
    userMessage?: string;
    suggestions?: string[];
    verificationComplete?: boolean;
    verificationStatus?: string;
    isVerified?: boolean;
    isFaceVerified?: boolean;
    isNicVerified?: boolean;
    successMessage?: string;
    // Additional verification details
    imageQualityValid?: boolean;
    nicNumberMatches?: boolean;
    faceComparisonSkipped?: boolean;
    nicImagePath?: string;
    extractedNicImagePath?: string;
    expectedNic?: string;
    extractedNic?: string;
    technicalError?: string;
  };
}

// Verification Step Status
export enum VerificationStepStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// Verification Steps for NIC Process
export interface VerificationStepInfo {
  id: string;
  title: string;
  description: string;
  status: VerificationStepStatus;
  errorMessage?: string;
  suggestions?: string[];
}

// Form Validation Types
export interface FormErrors {
  [key: string]: string | undefined;
}

// Camera Types
export interface CameraSettings {
  width: number;
  height: number;
  facingMode: 'user' | 'environment';
}

// File Upload Types
export interface FileUploadProps {
  file: File | null;
  preview?: string;
}

// Toast Message Types
export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning'
}

// Navigation Types
export interface RouteParams {
  userId?: string;
  step?: string;
}

// Component Props Types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface InputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Gemstone-related Types
export interface Certificate {
  issuingAuthority: string;
  reportNumber: string;
  date: string;
}

export interface GemstoneCardProps {
  gemstone: DetailedGemstone;
  onViewDetails: (id: string) => void;
}

export interface DetailedGemstone {
  id: string;
  name: string;
  price: number;
  image: string;
  certified: boolean;
  weight: number;
  color: string;
  species: string;
  variety: string;
  shape: string;
  cut: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  transparency: 'transparent' | 'translucent' | 'opaque';
  certificate?: Certificate;
  refractiveIndex?: {
    min: number;
    max: number;
  };
  polariscopeTest?: string;
  pleochroism?: 'strong' | 'moderate' | 'weak' | 'none';
  fluorescence?: {
    longWaveUV: 'strong' | 'moderate' | 'weak' | 'inert';
    shortWaveUV: 'strong' | 'moderate' | 'weak' | 'inert';
  };
  specificGravity?: number;
  microscopeExamination?: string;
  absorptionSpectrum?: string;
  additionalComments?: string;
}

export interface GemstoneFilters {
  species?: string[];
  variety?: string[];
  priceRange?: { min: number; max: number };
  weightRange?: { min: number; max: number };
  certified?: boolean;
  color?: string[];
  cut?: string[];
  shape?: string[];
  transparency?: ('transparent' | 'translucent' | 'opaque')[];
}

export interface Bid {
  id: string;
  userId: string;
  gemstoneId: string;
  amount: number;
  timestamp: string;
  status: 'active' | 'won' | 'lost' | 'withdrawn';
}

export interface Meeting {
  id: string;
  buyerId: string;
  sellerId: string;
  gemstoneId: string;
  scheduledDateTime: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface MeetingData {
  buyerId: string;
  sellerId: string;
  gemstoneId: string;
  proposedDateTime: string;
  location: string;
  notes?: string;
}

export interface PriceAttributes {
  species: string;
  variety: string;
  weight: number;
  color: string;
  clarity?: string;
  cut: string;
  certified: boolean;
}

export interface PricePrediction {
  estimatedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  confidence: number;
  factors: {
    label: string;
    impact: number;
    description: string;
  }[];
}

export interface GemstoneListingForm {
  // Basic Information
  gemstoneType: 'certified' | 'non-certified';
  images: File[];
  certificate?: File;
  
  // Certificate Details (conditional)
  issuingAuthority?: string;
  reportNumber?: string;
  certificateDate?: Date;
  
  // Gemstone Identification
  species: string;
  variety: string;
  
  // Physical Attributes
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  color: string;
  transparency: 'transparent' | 'translucent' | 'opaque';
  cut: string;
  shape: string;
  
  // Optical Properties
  refractiveIndex: {
    min: number;
    max: number;
  };
  polariscopeTest: string;
  pleochroism: 'strong' | 'moderate' | 'weak' | 'none';
  
  // Fluorescence
  fluorescence: {
    longWaveUV: 'strong' | 'moderate' | 'weak' | 'inert';
    shortWaveUV: 'strong' | 'moderate' | 'weak' | 'inert';
  };
  
  // Additional Properties
  specificGravity?: number;
  microscopeExamination?: string;
  absorptionSpectrum?: string;
  additionalComments?: string;
  
  // Pricing & Listing
  listingType: 'fixed' | 'auction';
  startingPrice: number;
  listingDuration: 7 | 14 | 30;
}
