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
    registered_at: string;
}

export interface ResumeRequestOneInfo {//관리자 단건 조회
    id: number;
    email?: string;
    field?: string;
    level?: string;
    price?: number;
    resume_url?: string;
    description?: string;
    description_image_url?: string;
    status?: string;
  }
  export interface PendingResumeOneType {//요청중인 이력서 단건
    field: string;
    level: string;
    resume_url: string;
    description_image_url: string;
    price: number;
    sales_quantity: number;
    description: string;
    status: string;
  }
  
export interface PendingResumeType {//요청중인 이력서 전체
    resume_id: number;
    summary: string;
    sales_quantity: number;
    field: string;
    level: string;
    status: string;
    modified_at: string;
  }

  export interface ListParams {//리스트, 나의 판매글
    sortType?: string;
    minPrice?: number;
    maxPrice?: number;
    field?: string;
    level?: string;
    pageStep?: string;
    lastId?: number;
  }

  export interface AdminListParams {
    periodCond?: string;
    status?: string;
    pageStep?: string;
    lastId?: number;
    registered_at?: string
  }
  // export interface GetMyListParams {
  //   sortType?: string;
  //   minPrice?: number;
  //   maxPrice?: number;
  //   field?: string;
  //   level?: string;
  //   pageStep?: string;
  //   lastId?: number;
  // }