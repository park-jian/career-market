// import { http, HttpResponse } from 'msw'
// import userData from './data/users.json'
// import resumeList from './data/resumes.json'
// import { ResumeInfo } from '../types/resume'
// import { OrderInfo } from '../types/order'
// import {orderList, cartInfo} from './data/orders.json'

export const handlers = [
  // http.get('/api/users/:id', ({ params }) => {
  //   const { id } = params
  //   const user = userData.users.find(u => u.id === Number(id))
    
  //   if (user) {
  //     return HttpResponse.json(user)
  //   } else {
  //     return new HttpResponse(null, { status: 404 })
  //   }
  // }),
  // //전체 조회
  // http.get('/open-api/v1/sale-resumes/page', () => {
  //   const list = resumeList.resumeList;
    
  //   if (list) {
  //     return HttpResponse.json(list)
  //   } else {
  //     return new HttpResponse(null, { status: 404 })
  //   }
  // }),
  // //단건 조회
  // http.get('/open-api/v1/sale-resumes/:salesPostId', ({ params }) => {
  //   const { salesPostId } = params;
  //   const id = parseInt(salesPostId as string, 10);
  //   const list = resumeList.resumeList;

  //   // id와 일치하는 이력서를 찾습니다.
  //   const resume = list.find((item: ResumeInfo) => item.id === id)
    
  //   if (resume) {
  //     return HttpResponse.json(resume)
  //   } else {
  //     return new HttpResponse(null, { status: 404 })
  //   }
  // }),
  
  // //주문 목록 전체 조회
  // http.get('/api/v1/orders', () => {
  //   const list = orderList;
    
  //   if (list) {
  //     return HttpResponse.json(list)
  //   } else {
  //     return new HttpResponse(null, { status: 404 })
  //   }
  // }),
  // //주문 목록 단건 조회
  // http.get('/api/v1/orders/:orderId', ({ params }) => {
  //   const { orderId } = params;
  //   const id = parseInt(orderId as string, 10);
  //   const list = orderList;

  //   // id와 일치하는 이력서를 찾습니다.
  //   const order = list.find((item: OrderInfo) => item.order_id === id)
    
  //   if (order) {
  //     return HttpResponse.json(order)
  //   } else {
  //     return new HttpResponse(null, { status: 404 })
  //   }
  // }),


  // //cart 조회
  // http.get('/api/v1/cart/summary', () => {

 
  //   if (cartInfo) {
  //     return HttpResponse.json(cartInfo)
  //   } else {
  //     return new HttpResponse(null, { status: 404 })
  //   }
  // }),
  
]