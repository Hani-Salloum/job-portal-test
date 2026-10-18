export interface ApplicantSocialLinks {
  instagram: string;
  linked_in: string;
  github: string;
  x: string;
}

export interface ApplicantWorkHistory {
  id: string;
  company_name: string;
  role_name: string;
  start_date: string;
  end_date: string | null;
}

export interface ApplicantCertificate {
  id: string;
  name: string;
  source: string;
  date: string;
}

export interface Applicant {
  id: string;
  image: string;
  name: string;
  phone_number: string;
  email: string;
  small_bio: string;
  years_of_experience: number;
  social_links: ApplicantSocialLinks;
  about: string;
  cv_url: string;
  skills: string[];
  work_history: ApplicantWorkHistory[];
  certificates: ApplicantCertificate[];
}
