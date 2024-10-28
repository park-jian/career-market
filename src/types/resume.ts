export interface ResumeInfo {
    resume_id: number;
    title: string;
    price: number;
    thumbnail_image_url: string;
    sales_quantity: number;
    view_count: number;
    field: string;
    level: string;
    status: string;
    registered_at: string;
}

export interface ResumeRequestInfo {
    id: number;
    summary: string;
    field: string;
    level: string;
    status: string;
    modified_at: string;
}

export interface ResumeRequestOneInfo {//관리자 단건 조회
    id: number;
    email: string;
    field: string;
    level: string;
    price: number;
    resume_url: string;
    description: string;
    description_image_url: string;
    status: string;
  }