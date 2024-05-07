export type FieldError = {
  message: string;
  field: string;
};

export type APIErrorResult = {
  errorsMessages: FieldError[];
};

export enum SortDirectionsstring {
  asc = 1,
  desc = 0,
}

export type qureT = {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};


export type LoginInputModel ={
  loginOrEmail:string,
  password:string
}

