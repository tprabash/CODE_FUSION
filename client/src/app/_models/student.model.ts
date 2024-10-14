export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  country: string;
  instituteName: string;
  intake: Date;
  expire: Date;
  courseTitle: string;
  studentIdCard: string;
  instituteId: number;
  licenceStatus: number;
  approvalStatus: number;
}
