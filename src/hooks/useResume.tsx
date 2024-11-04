import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {getList, addNewResume, getListOne } from "../api/resume"
import { ResumeInfo } from "../types/resume";
import { useEffect } from 'react';








//지금은 사용을 하지 않음
















// export function useResume(id: number | undefined) {
//   const query = useQuery<ResumeInfo, Error>({
//     queryKey: ["resume", id],
//     queryFn: () => id !== undefined ? getListOne(id) : Promise.reject('Invalid ID'),
//     staleTime: 1000 * 60,
//     enabled: id !== undefined, // id가 undefined일 때는 쿼리를 실행하지 않음
//   });

//   useEffect(() => {
//     //debugger;
//     if (query.isSuccess) {
//       console.log(`Resume with id ${id} fetched:`, query.data);
//     }
//     if (query.isError) {
//       console.error(`Error fetching resume with id ${id}:`, query.error);
//     }
//   }, [query.isSuccess, query.isError, query.data, query.error, id]);

//   return query;
// }

export default function useResumes() {
  const queryClient = useQueryClient();

  const resumesQuery = useQuery<ResumeInfo[], Error>({
    queryKey: ["resumes"],
    queryFn: getList,
    staleTime: 1000 * 60, // 1분
  });

  useEffect(() => {
    if (resumesQuery.isSuccess) {
      console.log('Resumes list fetched successfully:', resumesQuery.data);
    }
    if (resumesQuery.isError) {
      console.error('Error fetching resumes list:', resumesQuery.error);
    }
  }, [resumesQuery.isSuccess, resumesQuery.isError, resumesQuery.data, resumesQuery.error]);


  const addResume = useMutation({
    mutationFn: (resume: Omit<ResumeInfo, 'id'>) => addNewResume(resume),
    onSuccess: (data) => {
      console.log('New resume added successfully:', data);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: (error) => {
      console.error('Error adding new resume:', error);
    }
  });
  // useEffect(() => {
  //   console.log('Current resumes query state:', {
  //     isLoading: resumesQuery.isLoading,
  //     isError: resumesQuery.isError,
  //     error: resumesQuery.error,
  //     dataAvailable: !!resumesQuery.data,
  //     dataCount: resumesQuery.data?.length ?? 0
  //   });
  // }, [resumesQuery.isLoading, resumesQuery.isError, resumesQuery.error, resumesQuery.data]);

  return { resumesQuery, addResume };
}
